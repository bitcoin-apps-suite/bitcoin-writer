import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DocumentInscription } from '../types/DocumentInscription';

interface WorkTreeCanvasProps {
  versions: DocumentInscription[];
  onVersionSelect?: (version: DocumentInscription) => void;
  onVersionCheckout?: (version: DocumentInscription) => void;
  selectedVersion?: DocumentInscription | null;
  currentContent?: string;
  documentTitle?: string;
  currentHead?: DocumentInscription | null;
}

interface CanvasNode {
  x: number;
  y: number;
  version: DocumentInscription;
  children: CanvasNode[];
  parent?: CanvasNode;
  branchColor: string;
  isCurrentNode?: boolean;
  currentHash?: string;
}

// Utility function to calculate SHA256 hash
const calculateHash = async (content: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 8); // Show first 8 characters for display
};

const WorkTreeCanvas: React.FC<WorkTreeCanvasProps> = ({
  versions,
  onVersionSelect,
  onVersionCheckout,
  selectedVersion,
  currentContent = '',
  documentTitle = 'Untitled',
  currentHead
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [currentHash, setCurrentHash] = useState<string>('');
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedNode, setLastClickedNode] = useState<CanvasNode | null>(null);

  // Branch colors for different branches
  const branchColors = [
    '#ff9500', // Bitcoin orange
    '#22c55e', // Green
    '#3b82f6', // Blue  
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
  ];

  // Calculate hash whenever currentContent changes
  useEffect(() => {
    if (currentContent) {
      calculateHash(currentContent).then(setCurrentHash);
    } else {
      setCurrentHash('');
    }
  }, [currentContent]);

  // Build tree structure from versions
  const buildTree = useCallback(() => {
    // Git-style logic: show current node only if content differs from HEAD
    const hasCurrentContent = currentContent && currentContent.trim().length > 0;
    const allVersions = [...versions];
    
    // Check if current content differs from HEAD (not latest version)
    if (hasCurrentContent) {
      const headContent = currentHead?.content || '';
      const currentContentDifferent = currentContent !== headContent;
      
      if (currentContentDifferent) {
        // Create a virtual current node that branches from HEAD
        const currentNode: DocumentInscription = {
          localId: 'current',
          content: currentContent,
          status: 'draft',
          metadata: {
            title: documentTitle,
            version: (currentHead?.metadata.version || 0) + 1,
            author: 'current-user',
            createdAt: Date.now(),
            contentType: 'text/plain',
            contentHash: currentHash,
            wordCount: currentContent.split(/\s+/).length,
            characterCount: currentContent.length,
            isPublished: false,
            isPaid: false,
            // Branch from current HEAD, not latest version
            previousInscriptionId: currentHead?.inscriptionId || currentHead?.localId
          }
        };
        allVersions.push(currentNode);
      }
    }

    if (!allVersions.length) return [];

    // Sort versions by creation date
    const sortedVersions = allVersions.sort((a, b) => a.metadata.createdAt - b.metadata.createdAt);
    
    // Create nodes map
    const nodeMap = new Map<string, CanvasNode>();
    const rootNodes: CanvasNode[] = [];

    sortedVersions.forEach((version, index) => {
      const branchIndex = version.localId ? 
        Math.abs(version.localId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % branchColors.length : 0;
      
      const node: CanvasNode = {
        x: 0, // Will be calculated later
        y: 0, // Will be calculated later
        version,
        children: [],
        branchColor: branchColors[branchIndex],
        isCurrentNode: version.localId === 'current',
        currentHash: version.localId === 'current' ? currentHash : undefined
      };

      nodeMap.set(version.localId, node);

      // Find parent - DocumentInscription uses previousInscriptionId for parent relationship
      const parentId = version.metadata.previousInscriptionId;
      if (parentId) {
        // Find parent by inscriptionId or localId
        const parent = Array.from(nodeMap.values()).find(n => 
          n.version.inscriptionId === parentId || n.version.localId === parentId
        );
        if (parent) {
          node.parent = parent;
          parent.children.push(node);
        } else {
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    // Calculate positions - proper tree layout with branching
    const nodeRadius = 25;
    const levelHeight = 100;
    const branchSpacing = 150;
    
    // First pass: assign levels based on creation order (main timeline)
    const levelMap = new Map<CanvasNode, number>();
    const mainBranch: CanvasNode[] = [];
    
    // Build main branch (nodes with no parent or parent is previous in sequence)
    const sortedNodes = Array.from(nodeMap.values()).sort((a, b) => 
      a.version.metadata.createdAt - b.version.metadata.createdAt
    );
    
    sortedNodes.forEach(node => {
      if (!node.parent || mainBranch.includes(node.parent)) {
        mainBranch.push(node);
        levelMap.set(node, mainBranch.length - 1);
      }
    });
    
    // Position main branch horizontally
    const centerY = canvasSize.height / 2;
    const startX = 100;
    
    mainBranch.forEach((node, index) => {
      node.x = startX + (index * branchSpacing);
      node.y = centerY;
    });
    
    // Position branches that split off from main branch
    const branchOffsets = new Map<CanvasNode, number>();
    let currentBranchOffset = 1;
    
    Array.from(nodeMap.values()).forEach(node => {
      if (!mainBranch.includes(node)) {
        // This is a branch node
        const parentInMain = mainBranch.find(mainNode => 
          node.parent === mainNode || mainBranch.includes(node.parent!)
        );
        
        if (parentInMain) {
          // Branch off from main branch
          if (!branchOffsets.has(parentInMain)) {
            branchOffsets.set(parentInMain, currentBranchOffset);
            currentBranchOffset++;
          }
          
          const branchIndex = branchOffsets.get(parentInMain)!;
          const isUpperBranch = branchIndex % 2 === 1;
          const branchLevel = Math.ceil(branchIndex / 2);
          
          node.x = parentInMain.x + branchSpacing * 0.5;
          node.y = centerY + (isUpperBranch ? -1 : 1) * levelHeight * branchLevel;
        }
      }
    });

    return Array.from(nodeMap.values());
  }, [versions, canvasSize, currentContent, currentHash, documentTitle, currentHead]);

  // Update canvas size and rebuild tree when container resizes
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !canvas.parentElement) return;

      const rect = canvas.parentElement.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Rebuild nodes when versions or canvas size changes
  useEffect(() => {
    const newNodes = buildTree();
    setNodes(newNodes);
  }, [buildTree]);

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply view offset
    ctx.save();
    ctx.translate(viewOffset.x, viewOffset.y);

    // Draw connections first (behind nodes) - curved for branches
    nodes.forEach(node => {
      if (node.parent) {
        ctx.strokeStyle = node.branchColor;
        ctx.lineWidth = 2;
        
        const dx = node.x - node.parent.x;
        const dy = node.y - node.parent.y;
        
        if (Math.abs(dy) > 10) {
          // This is a branch connection - draw curved line
          const midX = node.parent.x + dx * 0.5;
          const controlX = node.parent.x + dx * 0.3;
          
          ctx.beginPath();
          ctx.moveTo(node.parent.x, node.parent.y);
          ctx.bezierCurveTo(
            controlX, node.parent.y,  // First control point
            midX, node.y,             // Second control point  
            node.x, node.y            // End point
          );
          ctx.stroke();
        } else {
          // Main branch - straight line
          ctx.beginPath();
          ctx.moveTo(node.parent.x, node.parent.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedVersion?.localId === node.version.localId;
      const isCurrent = node.isCurrentNode;
      const radius = isSelected ? 25 : (isCurrent ? 22 : 20);

      // Node circle - current nodes have different styling
      if (isCurrent) {
        // Current node has a pulsing orange border
        ctx.fillStyle = '#ff9500';
        ctx.strokeStyle = '#ffb347';
        ctx.lineWidth = 3;
        
        // Add pulsing effect
        const pulseRadius = radius + 2 * Math.sin(Date.now() / 300);
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      ctx.fillStyle = isCurrent ? '#ff9500' : node.branchColor;
      ctx.strokeStyle = isSelected ? '#fff' : (isCurrent ? '#ff9500' : node.branchColor);
      ctx.lineWidth = isSelected ? 3 : 2;
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Version number
      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.version.metadata.version.toString(), node.x, node.y);

      // Show hash outside current node
      if (isCurrent && node.currentHash) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.currentHash, node.x + radius + 8, node.y);
      }

      // HEAD pointer visualization
      const isHead = currentHead && (
        node.version.localId === currentHead.localId ||
        node.version.inscriptionId === currentHead.inscriptionId
      );
      
      if (isHead) {
        // Draw HEAD pointer label
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HEAD', node.x, node.y - radius - 12);
        
        // Draw pointer arrow
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - radius - 8);
        ctx.lineTo(node.x, node.y - radius - 3);
        ctx.stroke();
      }

      // Status indicator or current label
      if (isCurrent) {
        // Show "CURRENT" label below current node
        ctx.fillStyle = '#ff9500';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('CURRENT', node.x, node.y + radius + 12);
      } else {
        let statusColor = '#666';
        switch (node.version.status) {
          case 'inscribed': statusColor = '#22c55e'; break;
          case 'pending': statusColor = '#ff9500'; break;
          case 'failed': statusColor = '#ef4444'; break;
        }

        if (node.version.status !== 'draft') {
          ctx.fillStyle = statusColor;
          ctx.beginPath();
          ctx.arc(node.x + 15, node.y - 15, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Hover/selection highlight
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    ctx.restore();
  }, [nodes, selectedVersion, viewOffset, currentHead]);

  // Animation loop for pulsing current nodes
  useEffect(() => {
    const hasCurrentNode = nodes.some(node => node.isCurrentNode);
    if (!hasCurrentNode) return;

    let animationId: number;
    const animate = () => {
      // This will trigger a re-render which will redraw the canvas
      setNodes(prevNodes => [...prevNodes]);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [nodes.some(node => node.isCurrentNode)]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - viewOffset.x;
    const y = e.clientY - rect.top - viewOffset.y;

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
      return distance <= 25;
    });

    if (clickedNode) {
      const now = Date.now();
      const isDoubleClick = 
        lastClickedNode === clickedNode && 
        now - lastClickTime < 500; // 500ms double-click threshold

      if (isDoubleClick && onVersionCheckout) {
        // Double-click: checkout/restore this version
        onVersionCheckout(clickedNode.version);
      } else {
        // Single click: select version
        if (onVersionSelect) {
          onVersionSelect(clickedNode.version);
        }
        setLastClickTime(now);
        setLastClickedNode(clickedNode);
      }
    } else {
      // Start dragging
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
      setLastClickedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setViewOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="worktree-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
};

export default WorkTreeCanvas;
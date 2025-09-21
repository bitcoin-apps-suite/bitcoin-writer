import React, { useState } from 'react';
import './TasksPage.css';

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  reward: string;
  status: 'available' | 'in_progress' | 'completed';
  skills: string[];
  deliverables: string[];
}

const TasksPage: React.FC = () => {
  const [tasks] = useState<Task[]>([
    {
      id: 'bw-1',
      title: 'Implement Collaborative Editing',
      description: 'Add real-time collaborative editing features using WebRTC or similar technology',
      difficulty: 'Hard',
      category: 'Feature',
      reward: '5,000 BWRITER',
      status: 'available',
      skills: ['React', 'WebRTC', 'TypeScript', 'Real-time Systems'],
      deliverables: [
        'Real-time cursor tracking',
        'Conflict resolution system',
        'User presence indicators',
        'Comprehensive testing'
      ]
    },
    {
      id: 'bw-2',
      title: 'Add Markdown Export',
      description: 'Implement functionality to export documents as Markdown files',
      difficulty: 'Easy',
      category: 'Feature',
      reward: '1,000 BWRITER',
      status: 'available',
      skills: ['React', 'TypeScript', 'File Handling'],
      deliverables: [
        'Export button in toolbar',
        'Proper Markdown formatting',
        'Preserve document structure'
      ]
    },
    {
      id: 'bw-3',
      title: 'Create Document Templates',
      description: 'Design and implement a template system for common document types',
      difficulty: 'Medium',
      category: 'Feature',
      reward: '2,500 BWRITER',
      status: 'available',
      skills: ['React', 'UI/UX', 'TypeScript'],
      deliverables: [
        'Template gallery UI',
        'At least 10 professional templates',
        'Template customization options'
      ]
    },
    {
      id: 'bw-4',
      title: 'Optimize Document Loading',
      description: 'Improve performance for loading large documents from the blockchain',
      difficulty: 'Medium',
      category: 'Performance',
      reward: '2,000 BWRITER',
      status: 'available',
      skills: ['React', 'BSV', 'Performance Optimization'],
      deliverables: [
        'Lazy loading implementation',
        'Caching strategy',
        'Loading time improvement metrics'
      ]
    },
    {
      id: 'bw-5',
      title: 'Add Version Control UI',
      description: 'Create an interface for viewing and managing document versions',
      difficulty: 'Hard',
      category: 'Feature',
      reward: '4,000 BWRITER',
      status: 'available',
      skills: ['React', 'BSV', 'UI/UX', 'Git-like Systems'],
      deliverables: [
        'Version history viewer',
        'Diff visualization',
        'Rollback functionality',
        'Branch/merge capabilities'
      ]
    },
    {
      id: 'bw-6',
      title: 'Write API Documentation',
      description: 'Create comprehensive API documentation for the Bitcoin Writer SDK',
      difficulty: 'Easy',
      category: 'Documentation',
      reward: '1,500 BWRITER',
      status: 'available',
      skills: ['Technical Writing', 'TypeScript', 'API Design'],
      deliverables: [
        'Complete API reference',
        'Code examples',
        'Integration guides'
      ]
    }
  ]);

  const [filter, setFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'easy') return task.difficulty === 'Easy';
    if (filter === 'medium') return task.difficulty === 'Medium';
    if (filter === 'hard') return task.difficulty === 'Hard';
    return task.category.toLowerCase() === filter;
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleApply = () => {
    setShowContactForm(true);
  };

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Bitcoin Writer Tasks</h1>
          <p className="tasks-subtitle">
            Contribute to Bitcoin Writer and earn BWRITER tokens
          </p>
        </div>

        <div className="tasks-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={filter === 'easy' ? 'active' : ''}
            onClick={() => setFilter('easy')}
          >
            Easy
          </button>
          <button
            className={filter === 'medium' ? 'active' : ''}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button
            className={filter === 'hard' ? 'active' : ''}
            onClick={() => setFilter('hard')}
          >
            Hard
          </button>
          <button
            className={filter === 'feature' ? 'active' : ''}
            onClick={() => setFilter('feature')}
          >
            Features
          </button>
          <button
            className={filter === 'documentation' ? 'active' : ''}
            onClick={() => setFilter('documentation')}
          >
            Documentation
          </button>
        </div>

        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="task-card"
              onClick={() => handleTaskClick(task)}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`task-difficulty ${task.difficulty.toLowerCase()}`}>
                  {task.difficulty}
                </span>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="task-category">{task.category}</span>
                <span className="task-reward">{task.reward}</span>
              </div>
              <div className="task-skills">
                {task.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
                {task.skills.length > 3 && (
                  <span className="skill-tag">+{task.skills.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedTask && (
          <div className="task-modal" onClick={() => setSelectedTask(null)}>
            <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setSelectedTask(null)}>×</button>
              <h2>{selectedTask.title}</h2>
              <div className="task-modal-meta">
                <span className={`task-difficulty ${selectedTask.difficulty.toLowerCase()}`}>
                  {selectedTask.difficulty}
                </span>
                <span className="task-category">{selectedTask.category}</span>
                <span className="task-reward">{selectedTask.reward}</span>
              </div>
              <p className="task-modal-description">{selectedTask.description}</p>
              
              <div className="task-modal-section">
                <h3>Required Skills</h3>
                <div className="task-skills">
                  {selectedTask.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="task-modal-section">
                <h3>Deliverables</h3>
                <ul className="task-deliverables">
                  {selectedTask.deliverables.map(deliverable => (
                    <li key={deliverable}>{deliverable}</li>
                  ))}
                </ul>
              </div>

              <button className="apply-button" onClick={handleApply}>
                Apply for this Task
              </button>
            </div>
          </div>
        )}

        {showContactForm && (
          <div className="contact-modal" onClick={() => setShowContactForm(false)}>
            <div className="contact-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={() => setShowContactForm(false)}>×</button>
              <h2>Apply for Task</h2>
              <p>Please provide your details and we'll get in touch with you.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your interest! We will contact you soon.');
                setShowContactForm(false);
                setSelectedTask(null);
              }}>
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Email Address" required />
                <input type="text" placeholder="GitHub Username" required />
                <textarea placeholder="Tell us about your experience with the required skills" rows={4} required />
                <button type="submit">Submit Application</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
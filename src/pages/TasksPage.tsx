import React, { useState, useEffect } from 'react';
import './TasksPage.css';

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Critical';
  category: string;
  reward: string;
  status: 'available' | 'in_progress' | 'completed';
  skills: string[];
  deliverables: string[];
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  estimatedHours?: number;
  assignee?: string;
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch GitHub issues on mount
  useEffect(() => {
    fetchGitHubIssues();
  }, []);
  
  const fetchGitHubIssues = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/issues?state=open&per_page=100');
      const issues = await response.json();
      
      const mappedTasks: Task[] = issues.map((issue: any) => {
        // Parse priority and reward from issue body
        const body = issue.body || '';
        const priorityMatch = body.match(/\*\*Priority:\*\*\s*(Critical|High|Medium|Low)/i);
        const hoursMatch = body.match(/\*\*Estimated Hours:\*\*\s*(\d+)/i);
        const rewardMatch = body.match(/\*\*Token Reward:\*\*\s*([\d,]+)\s*BWRITER/i);
        
        // Map GitHub labels to categories
        const labels = issue.labels || [];
        let category = 'Feature';
        if (labels.some((l: any) => l.name === 'bug')) category = 'Bug Fix';
        if (labels.some((l: any) => l.name === 'documentation')) category = 'Documentation';
        if (labels.some((l: any) => l.name === 'enhancement')) category = 'Enhancement';
        
        // Map priority to difficulty
        let difficulty: Task['difficulty'] = 'Medium';
        const priority = priorityMatch ? priorityMatch[1] : 'Medium';
        if (priority === 'Critical') difficulty = 'Critical';
        if (priority === 'High') difficulty = 'Hard';
        if (priority === 'Medium') difficulty = 'Medium';
        if (priority === 'Low') difficulty = 'Easy';
        
        // Extract skills from issue body
        const skillsMatch = body.match(/## Files to modify[\s\S]*?## Acceptance Criteria/);
        let skills: string[] = ['TypeScript', 'React'];
        if (body.includes('blockchain') || body.includes('BSV')) skills.push('BSV');
        if (body.includes('HandCash')) skills.push('HandCash SDK');
        if (body.includes('OAuth')) skills.push('OAuth');
        if (body.includes('PDF')) skills.push('PDF Generation');
        
        // Extract deliverables from acceptance criteria
        const deliverables: string[] = [];
        const criteriaMatch = body.match(/## Acceptance Criteria[\s\S]*?(\n\n|\*\*|$)/);
        if (criteriaMatch) {
          const criteria = criteriaMatch[0];
          const items = criteria.match(/- \[ \] .*/g) || [];
          items.forEach((item: string) => {
            deliverables.push(item.replace('- [ ] ', ''));
          });
        }
        
        return {
          id: `issue-${issue.number}`,
          title: issue.title,
          description: body.split('## Requirements')[0].replace('## Description', '').trim(),
          difficulty,
          category,
          reward: rewardMatch ? `${rewardMatch[1]} BWRITER` : '2,000 BWRITER',
          status: issue.assignee ? 'in_progress' : 'available',
          skills,
          deliverables: deliverables.length > 0 ? deliverables : ['See issue for details'],
          githubIssueNumber: issue.number,
          githubIssueUrl: issue.html_url,
          estimatedHours: hoursMatch ? parseInt(hoursMatch[1]) : 8,
          assignee: issue.assignee ? issue.assignee.login : undefined
        };
      });
      
      setTasks(mappedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch GitHub issues:', error);
      // Fallback to some default tasks
      setTasks([
        {
          id: 'default-1',
          title: 'Check GitHub for latest tasks',
          description: 'Visit our GitHub repository to see the latest available tasks',
          difficulty: 'Easy',
          category: 'Information',
          reward: 'Various',
          status: 'available',
          skills: ['GitHub'],
          deliverables: ['Visit repository'],
          githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues'
        }
      ]);
      setLoading(false);
    }
  };

  const [filter, setFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'critical') return task.difficulty === 'Critical';
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
            className={filter === 'critical' ? 'active' : ''}
            onClick={() => setFilter('critical')}
          >
            Critical
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

        {loading ? (
          <div className="tasks-loading">
            <p>Loading tasks from GitHub...</p>
          </div>
        ) : (
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
        )}

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

              <div className="task-modal-actions">
                {selectedTask.githubIssueUrl && (
                  <a 
                    href={selectedTask.githubIssueUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-link-button"
                  >
                    View on GitHub →
                  </a>
                )}
                <button className="apply-button" onClick={handleApply}>
                  Apply for this Task
                </button>
              </div>
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
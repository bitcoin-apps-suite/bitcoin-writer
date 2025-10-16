import React, { useState, useEffect } from 'react';
import { GitHubAuthService, GitHubUser } from '../services/GitHubAuthService';
import { TaskContractService } from '../services/TaskContractService';
import { HandCashService } from '../services/HandCashService';
import './TaskClaimModal.css';

interface TaskClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    tokenReward: number;
    category: string;
    githubIssueNumber?: number;
  };
  onTaskClaimed?: (taskId: string) => void;
}

const TaskClaimModal: React.FC<TaskClaimModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskClaimed
}) => {
  const [step, setStep] = useState<'github' | 'handcash' | 'contract' | 'claimed'>('github');
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [handCashUser, setHandCashUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  
  const githubAuth = new GitHubAuthService();
  const contractService = new TaskContractService();
  const handcashService = new HandCashService();

  useEffect(() => {
    // Check if already authenticated
    if (githubAuth.isAuthenticated()) {
      setGithubUser(githubAuth.getCurrentUser());
      setStep('handcash');
    }
  }, []);

  useEffect(() => {
    // Update countdown timer
    if (step === 'claimed') {
      const contract = contractService.getContract(task.id);
      if (contract) {
        const timer = setInterval(() => {
          const timeRemaining = contractService.getTimeRemaining(contract);
          if (timeRemaining.expired) {
            clearInterval(timer);
            setCountdown(null);
          } else {
            setCountdown({
              days: timeRemaining.days,
              hours: timeRemaining.hours,
              minutes: timeRemaining.minutes
            });
          }
        }, 60000); // Update every minute

        return () => clearInterval(timer);
      }
    }
  }, [step, task.id]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      githubAuth.login();
    } catch (err: any) {
      setError(err.message || 'Failed to login with GitHub');
      setIsLoading(false);
    }
  };

  const handleHandCashLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await handcashService.login();
      const profile = handcashService.getCurrentUser();
      if (profile) {
        setHandCashUser(profile);
        setStep('contract');
      } else {
        throw new Error('Failed to get user profile after login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect HandCash wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignContract = async () => {
    if (!githubUser || !handCashUser) return;

    setIsLoading(true);
    setError('');
    
    try {
      // Create contract
      const contract = await contractService.createContract(
        task.id,
        task.githubIssueNumber || parseInt(task.id),
        githubUser.login,
        handCashUser.handle,
        task.tokenReward
      );

      // Sign contract with HandCash
      const signature = {
        githubId: githubUser.login,
        handCashHandle: handCashUser.handle,
        timestamp: Date.now(),
        signature: 'mock_signature' // TODO: Implement actual HandCash signing
      };

      await contractService.signContract(task.id, signature);

      // Assign GitHub issue
      if (task.githubIssueNumber) {
        await githubAuth.assignIssue(task.githubIssueNumber);
      }

      setStep('claimed');
      if (onTaskClaimed) {
        onTaskClaimed(task.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign contract');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'expert': return '#9C27B0';
      default: return '#757575';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="task-claim-modal-overlay" onClick={onClose}>
      <div className="task-claim-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Claim Development Task</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="task-info">
          <h3>{task.title}</h3>
          <p className="task-description">{task.description}</p>
          
          <div className="task-meta">
            <span className="category">{task.category}</span>
            <span 
              className="difficulty" 
              style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
            >
              {task.difficulty}
            </span>
            <span className="reward">
              🪙 {task.tokenReward}% ({(task.tokenReward * 10000000).toLocaleString()} $BWRITER)
            </span>
          </div>

          {task.githubIssueNumber && (
            <a 
              href={`https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/${task.githubIssueNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-issue-link"
            >
              View GitHub Issue #{task.githubIssueNumber} →
            </a>
          )}
        </div>

        <div className="claim-steps">
          {/* Step 1: GitHub Authentication */}
          <div className={`step ${step === 'github' ? 'active' : ''} ${githubUser ? 'completed' : ''}`}>
            <div className="step-header">
              <span className="step-number">1</span>
              <span className="step-title">GitHub Authentication</span>
              {githubUser && <span className="check">✓</span>}
            </div>
            
            {step === 'github' && !githubUser && (
              <div className="step-content">
                <p>Sign in with your GitHub account to claim this task</p>
                <button 
                  className="github-login-btn"
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                >
                  <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
                </button>
              </div>
            )}
            
            {githubUser && (
              <div className="step-content">
                <div className="user-info">
                  <img src={githubUser.avatar_url} alt={githubUser.login} />
                  <div>
                    <strong>{githubUser.name || githubUser.login}</strong>
                    <span>@{githubUser.login}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: HandCash Wallet */}
          <div className={`step ${step === 'handcash' ? 'active' : ''} ${handCashUser ? 'completed' : ''}`}>
            <div className="step-header">
              <span className="step-number">2</span>
              <span className="step-title">HandCash Wallet</span>
              {handCashUser && <span className="check">✓</span>}
            </div>
            
            {step === 'handcash' && !handCashUser && (
              <div className="step-content">
                <p>Connect your HandCash wallet to receive token rewards</p>
                <button 
                  className="handcash-login-btn"
                  onClick={handleHandCashLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect HandCash Wallet'}
                </button>
              </div>
            )}
            
            {handCashUser && (
              <div className="step-content">
                <div className="user-info">
                  <div>
                    <strong>{handCashUser.displayName || handCashUser.handle}</strong>
                    <span>${handCashUser.handle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Sign Contract */}
          <div className={`step ${step === 'contract' ? 'active' : ''} ${step === 'claimed' ? 'completed' : ''}`}>
            <div className="step-header">
              <span className="step-number">3</span>
              <span className="step-title">Sign Contract</span>
              {step === 'claimed' && <span className="check">✓</span>}
            </div>
            
            {step === 'contract' && (
              <div className="step-content">
                <div className="contract-preview">
                  <h4>Development Contract</h4>
                  <div className="contract-details">
                    <div className="contract-item">
                      <span className="label">Developer:</span>
                      <span className="value">@{githubUser?.login}</span>
                    </div>
                    <div className="contract-item">
                      <span className="label">Wallet:</span>
                      <span className="value">${handCashUser?.handle}</span>
                    </div>
                    <div className="contract-item">
                      <span className="label">Task:</span>
                      <span className="value">{task.title}</span>
                    </div>
                    <div className="contract-item">
                      <span className="label">Reward:</span>
                      <span className="value">{(task.tokenReward * 10000000).toLocaleString()} $BWRITER</span>
                    </div>
                    <div className="contract-item">
                      <span className="label">Deadline:</span>
                      <span className="value">30 days from signing</span>
                    </div>
                  </div>
                  
                  <div className="contract-terms">
                    <label>
                      <input type="checkbox" required />
                      I agree to complete this task within 30 days and understand that the task will be released if not completed by the deadline
                    </label>
                  </div>
                  
                  <button 
                    className="sign-contract-btn"
                    onClick={handleSignContract}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing Contract...' : 'Sign Contract & Claim Task'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success State */}
          {step === 'claimed' && (
            <div className="claim-success">
              <div className="success-icon">✅</div>
              <h3>Task Successfully Claimed!</h3>
              <p>You have successfully claimed this development task.</p>
              
              {countdown && (
                <div className="countdown-timer">
                  <h4>Time Remaining:</h4>
                  <div className="countdown">
                    <div className="time-unit">
                      <span className="value">{countdown.days}</span>
                      <span className="label">Days</span>
                    </div>
                    <div className="time-unit">
                      <span className="value">{countdown.hours}</span>
                      <span className="label">Hours</span>
                    </div>
                    <div className="time-unit">
                      <span className="value">{countdown.minutes}</span>
                      <span className="label">Minutes</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="next-steps">
                <h4>Next Steps:</h4>
                <ol>
                  <li>Fork the repository</li>
                  <li>Create a feature branch</li>
                  <li>Implement the feature</li>
                  <li>Submit a pull request</li>
                  <li>Get it reviewed and merged</li>
                  <li>Receive your tokens automatically!</li>
                </ol>
              </div>
              
              <button className="close-modal-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskClaimModal;
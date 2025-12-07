'use client';

import React, { useState, useEffect } from 'react';
import { KVStoreConfig } from '../lib/kvstore-quill-integration';

interface KVStoreSettingsProps {
  config: Partial<KVStoreConfig>;
  onConfigChange: (config: Partial<KVStoreConfig>) => void;
}

export function KVStoreSettings({ config, onConfigChange }: KVStoreSettingsProps) {
  const [localConfig, setLocalConfig] = useState<Partial<KVStoreConfig>>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (key: keyof KVStoreConfig, value: any) => {
    const newConfig = {
      ...localConfig,
      [key]: value,
    };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleIntervalChange = (value: string) => {
    const seconds = parseInt(value, 10);
    if (!isNaN(seconds) && seconds > 0) {
      handleChange('autoSaveInterval', seconds * 1000);
    }
  };

  return (
    <div className="kvstore-settings p-4 bg-gray-50 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">KVStore Settings</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localConfig.enabled ?? true}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Enable KVStore</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localConfig.autoSave ?? true}
            onChange={(e) => handleChange('autoSave', e.target.checked)}
            disabled={!localConfig.enabled}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Auto-save</span>
        </label>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Auto-save interval (seconds):
          </label>
          <input
            type="number"
            min="5"
            max="600"
            value={(localConfig.autoSaveInterval ?? 30000) / 1000}
            onChange={(e) => handleIntervalChange(e.target.value)}
            disabled={!localConfig.enabled || !localConfig.autoSave}
            className="form-input w-20 px-2 py-1 text-sm border-gray-300 rounded"
          />
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localConfig.encryptContent ?? true}
            onChange={(e) => handleChange('encryptContent', e.target.checked)}
            disabled={!localConfig.enabled}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Encrypt content</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={localConfig.useCall ?? false}
            onChange={(e) => handleChange('useCall', e.target.checked)}
            disabled={!localConfig.enabled}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Use 'call' for save operations
          </span>
        </label>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Topic name:
          </label>
          <input
            type="text"
            value={localConfig.topicName ?? 'quill-documents'}
            onChange={(e) => handleChange('topicName', e.target.value)}
            disabled={!localConfig.enabled}
            className="form-input px-2 py-1 text-sm border-gray-300 rounded"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> When "Use 'call' for save operations" is enabled, 
          all save operations will use the blockchain 'call' method, which may incur 
          transaction fees but provides better persistence guarantees.
        </p>
      </div>
    </div>
  );
}
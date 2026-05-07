import { useState, useCallback, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'nova-ai-secure-storage-key-2026';
const STORAGE_KEY = 'nova_chat_history';
const EXPIRATION_DAYS = 30;

export function useChatHistory() {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load and decrypt conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = useCallback(() => {
    try {
      const encryptedData = localStorage.getItem(STORAGE_KEY);
      if (!encryptedData) {
        setConversations([]);
        return;
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedData) {
        throw new Error('Decryption failed or data is corrupted');
      }

      const parsed = JSON.parse(decryptedData);
      
      // Filter out expired conversations (older than 30 days)
      const now = new Date().getTime();
      const expirationMs = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
      
      const validConversations = parsed.filter(conv => {
        const convTime = new Date(conv.updatedAt).getTime();
        return (now - convTime) < expirationMs;
      });

      // If some expired, re-save
      if (validConversations.length !== parsed.length) {
        _saveToStorage(validConversations);
      }

      setConversations(validConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error('❌ Failed to load chat history:', error);
      setConversations([]);
    }
  }, []);

  const _saveToStorage = (data) => {
    try {
      const jsonStr = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('❌ Failed to encrypt and save chat history:', error);
    }
  };

  const saveConversation = useCallback((id, title, messages) => {
    try {
      const newConv = {
        id: id || crypto.randomUUID(),
        title: title || `Conversation ${new Date().toLocaleDateString()}`,
        messages,
        updatedAt: new Date().toISOString()
      };

      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== newConv.id);
        const updated = [newConv, ...filtered];
        _saveToStorage(updated);
        return updated;
      });
      console.log('✅ Conversation saved securely');
      return newConv.id;
    } catch (error) {
      console.error('❌ Failed to save conversation:', error);
    }
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      _saveToStorage(updated);
      console.log(`✅ Conversation ${id} deleted`);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConversations([]);
    console.log('✅ Chat history cleared');
  }, []);

  const exportConversation = useCallback((id, format = 'json') => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) {
      console.error('❌ Conversation not found for export');
      return;
    }

    let content = '';
    let mimeType = '';
    let ext = '';

    if (format === 'json') {
      content = JSON.stringify(conv, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else if (format === 'txt') {
      content = conv.messages.map(m => `[${new Date(m.created).toLocaleString()}] ${m.role.toUpperCase()}:\n${m.content}\n`).join('\n');
      mimeType = 'text/plain';
      ext = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`✅ Exported conversation in ${format.toUpperCase()} format`);
  }, [conversations]);

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return {
    conversations: filteredConversations,
    searchQuery,
    setSearchQuery,
    saveConversation,
    loadConversations,
    deleteConversation,
    clearHistory,
    exportConversation
  };
}
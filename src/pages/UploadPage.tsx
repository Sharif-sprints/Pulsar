import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { Product } from '../types';

interface UploadPageProps {
  onSubmit: (product: Omit<Product, 'id' | 'creator'>) => void;
}

export function UploadPage({ onSubmit }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'automation' as Product['category'],
    tags: '',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80' // Default image
  });
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      image: formData.image,
      tags: formData.tags.split(',').map(tag => tag.trim())
    });
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Your Automation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              placeholder="Enter your automation title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 h-32"
              placeholder="Describe your automation..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Price ($)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              min="0"
              step="0.01"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              placeholder="Set your price"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              required
            >
              <option value="automation">Automation</option>
              <option value="integration">Integration</option>
              <option value="workflow">Workflow</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
              placeholder="Enter tags separated by commas"
            />
          </div>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg mb-2">Drag and drop your files here</p>
            <p className="text-sm text-gray-400 mb-4">or</p>
            <label className="inline-block">
              <span className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">
                Browse Files
              </span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInput}
              />
            </label>
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-900 p-3 rounded-lg"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors"
          >
            Upload Automation
          </button>
        </form>
      </div>
    </div>
  );
}
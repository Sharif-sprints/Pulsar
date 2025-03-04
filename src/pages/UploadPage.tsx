import React, { useState } from 'react';
import { Upload, X, ArrowRight, CheckCircle, Clock, Video, Code, Database, Globe, Server } from 'lucide-react';
import type { Product } from '../types';

interface UploadPageProps {
  onSubmit: (product: Omit<Product, 'id' | 'creator' | 'pulses'>) => void;
}

export function UploadPage({ onSubmit }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'automation' as Product['category'],
    tags: '',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80', // Default image
    videoUrl: '',
    complexity: 'medium' as 'beginner' | 'medium' | 'advanced',
    integrations: [] as string[],
    techStack: [] as string[],
    faq: [] as { question: string; answer: string }[],
    creatorBio: '',
    consultationAvailable: false,
    consultationRate: ''
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

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const steps = [
    { name: 'Upload', icon: Upload },
    { name: 'Curation', icon: Clock },
    { name: 'Live', icon: CheckCircle }
  ];

  const addFaqItem = () => {
    setFormData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeFaqItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  const toggleIntegration = (integration: string) => {
    setFormData(prev => {
      if (prev.integrations.includes(integration)) {
        return {
          ...prev,
          integrations: prev.integrations.filter(i => i !== integration)
        };
      } else {
        return {
          ...prev,
          integrations: [...prev.integrations, integration]
        };
      }
    });
  };

  const toggleTechStack = (tech: string) => {
    setFormData(prev => {
      if (prev.techStack.includes(tech)) {
        return {
          ...prev,
          techStack: prev.techStack.filter(t => t !== tech)
        };
      } else {
        return {
          ...prev,
          techStack: [...prev.techStack, tech]
        };
      }
    });
  };

  // Available integrations
  const availableIntegrations = [
    "Zapier", "Slack", "Google Workspace", "Microsoft 365", 
    "Notion", "Airtable", "GitHub", "AWS", "Azure", "Google Cloud"
  ];

  // Available tech stack options
  const availableTechStack = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", 
    "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "TensorFlow"
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Submit Your AI Workflow</h1>
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index + 1 < currentStep 
                      ? 'bg-green-500' 
                      : index + 1 === currentStep 
                        ? 'bg-purple-600' 
                        : 'bg-gray-700'
                  }`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-2 text-sm">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {currentStep === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 h-32"
                placeholder="Describe your automation..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Price ($) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                min="0"
                step="0.01"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py- 2 px-4 focus:outline-none focus:border-purple-500"
                placeholder="Set your price"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category <span className="text-red-500">*</span></label>
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
              <label className="block text-sm font-medium mb-2">Tags <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                placeholder="Enter tags separated by commas"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Complexity Level <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['beginner', 'medium', 'advanced'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="complexity"
                      value={level}
                      checked={formData.complexity === level}
                      onChange={() => setFormData(prev => ({ ...prev, complexity: level as any }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Demo Video URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Video className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Add a YouTube or Vimeo URL to showcase your workflow in action
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Technology Stack</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {availableTechStack.map((tech) => (
                  <label key={tech} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.techStack.includes(tech)}
                      onChange={() => toggleTechStack(tech)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Select the technologies used in your workflow
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Integrations</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {availableIntegrations.map((integration) => (
                  <label key={integration} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.integrations.includes(integration)}
                      onChange={() => toggleIntegration(integration)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <span>{integration}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Select the platforms your workflow integrates with
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">FAQ Items</label>
                <button
                  type="button"
                  onClick={addFaqItem}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  + Add FAQ
                </button>
              </div>
              
              {formData.faq.length === 0 ? (
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm">
                    Add FAQ items to help users understand your workflow
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.faq.map((faq, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">FAQ Item #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeFaqItem(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                            placeholder="Question"
                          />
                        </div>
                        <div>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 h-20"
                            placeholder="Answer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">About You (Creator Bio)</label>
              <textarea
                value={formData.creatorBio}
                onChange={(e) => setFormData(prev => ({ ...prev, creatorBio: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500 h-24"
                placeholder="Tell potential buyers about your expertise and experience..."
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="consultationAvailable"
                  checked={formData.consultationAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationAvailable: e.target.checked }))}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                />
                <label htmlFor="consultationAvailable" className="ml-2 block text-sm font-medium">
                  Offer Consultation Services
                </label>
              </div>
              
              {formData.consultationAvailable && (
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={formData.consultationRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultationRate: e.target.value }))}
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    placeholder="e.g. 150"
                  />
                </div>
              )}
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Review Your Submission</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Title</div>
                  <div className="col-span-2 font-medium">{formData.title}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Description</div>
                  <div className="col-span-2">{formData.description}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Price</div>
                  <div className="col-span-2">${formData.price}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Category</div>
                  <div className="col-span-2">{formData.category}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Complexity</div>
                  <div className="col-span-2 capitalize">{formData.complexity}</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Tags</div>
                  <div className="col-span-2">
                    {formData.tags.split(',').map((tag, index) => (
                      <span key={index} className="inline-block bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                
                {formData.videoUrl && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">Demo Video</div>
                    <div className="col-span-2">
                      <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                        {formData.videoUrl}
                      </a>
                    </div>
                  </div>
                )}
                
                {formData.techStack.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">Tech Stack</div>
                    <div className="col-span-2">
                      {formData.techStack.map((tech, index) => (
                        <span key={index} className="inline-block bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.integrations.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">Integrations</div>
                    <div className="col-span-2">
                      {formData.integrations.map((integration, index) => (
                        <span key={index} className="inline-block bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs mr-2 mb-2">
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.faq.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">FAQ Items</div>
                    <div className="col-span-2">
                      <div className="space-y-2">
                        {formData.faq.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-3 rounded-lg">
                            <p className="font-medium">{faq.question}</p>
                            <p className="text-sm text-gray-300 mt-1">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {formData.creatorBio && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">Creator Bio</div>
                    <div className="col-span-2">{formData.creatorBio}</div>
                  </div>
                )}
                
                {formData.consultationAvailable && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 text-gray-400">Consultation</div>
                    <div className="col-span-2">
                      Available at ${formData.consultationRate}/hour
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1 text-gray-400">Files</div>
                  <div className="col-span-2">
                    {files.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No files uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-800">
              <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
              <p className="text-gray-300">
                Your submission will be reviewed by our curation team. This process typically takes 1-3 business days.
                You'll receive an email notification once your workflow has been reviewed.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 px-4 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors"
              >
                Submit for Review
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center space-y-6">
            <div className="bg-green-900/30 p-8 rounded-xl border border-green-800">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Submission Complete!</h2>
              <p className="text-gray-300 mb-4">
                Your AI workflow has been submitted for review. Our curation team will evaluate your submission and get back to you within 1-3 business days.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg inline-block">
                <p className="text-sm text-gray-400">Submission ID</p>
                <p className="font-mono">{Math.random().toString(36).substring(2, 15)}</p>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-8 transition-colors inline-flex items-center gap-2"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
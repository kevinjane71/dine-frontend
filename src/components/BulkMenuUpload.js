'use client';

import { useState, useRef } from 'react';
import { 
  FaUpload, 
  FaTimes, 
  FaSpinner, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaImage,
  FaFilePdf
} from 'react-icons/fa';
import apiClient from '../lib/api';

const BulkMenuUpload = ({ 
  isOpen, 
  onClose, 
  restaurantId, 
  onMenuItemsAdded,
  currentMenuItems = []
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedMenus, setExtractedMenus] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 30 * 1024 * 1024; // 30MB per file
    const maxTotalSize = 300 * 1024 * 1024; // 300MB total
    const maxFiles = 10;
    
    let errors = [];
    let validFiles = [];
    
    // Check file count
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed. Only the first ${maxFiles} files will be processed.`);
    }
    
    // Check total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      errors.push(`Total file size exceeds ${maxTotalSize / (1024 * 1024)}MB limit.`);
    }
    
    // Check individual files - now support all file types
    files.slice(0, maxFiles).forEach((file, index) => {
      // Support all file types for menu extraction
      const supportedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff',
        'application/pdf',
        'text/csv', 'application/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain',
        'application/octet-stream' // For live photos and unknown types
      ];
      
      // More lenient validation - accept any file type but warn about unsupported ones
      const isSupportedType = supportedTypes.some(type => 
        file.type.includes(type.split('/')[1]) || 
        file.type === type ||
        file.type.startsWith('image/') || // Accept any image type
        file.type.includes('pdf') || // Accept any PDF variant
        file.type.includes('csv') || // Accept any CSV variant
        file.type.includes('excel') || // Accept any Excel variant
        file.type.includes('document') || // Accept any document variant
        file.type.includes('text') // Accept any text variant
      );
      
      if (!isSupportedType) {
        console.log(`⚠️ Unsupported file type: ${file.type} for ${file.name}, but will attempt extraction anyway`);
        // Don't reject the file, just log a warning
      }
      
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (${Math.round(file.size / (1024 * 1024))}MB). Maximum 30MB per file.`);
        return;
      }
      
      if (file.size === 0) {
        errors.push(`${file.name}: Empty file.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (errors.length > 0) {
      setError(errors.join(' '));
    } else {
      setError('');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAndExtract = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    if (!restaurantId) {
      setError('Restaurant ID is required');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      setSuccess('');

      // Check authentication
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        setError('Please log in to upload files');
        setProcessing(false);
        return;
      }

      if (!userData) {
        setError('User session not found. Please log in again.');
        setProcessing(false);
        return;
      }

      console.log('Uploading files for restaurant:', restaurantId);

      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('menuFiles', file);
      });

      const response = await apiClient.bulkUploadMenu(restaurantId, formData);

      // Handle different response scenarios
      if (response.success === false) {
        // Complete failure
        setError(response.error || 'Upload failed');
        return;
      }

      if (response.data && response.data.length > 0) {
        setExtractedMenus(response.data);
        
        // Process extraction results
        const allMenuItems = response.data.flatMap(menu => menu.menuItems);
        const extractionResults = response.data;
        
        // Check extraction status for each file
        const noMenuDataFiles = extractionResults.filter(result => result.extractionStatus === 'no_menu_data');
        const failedFiles = extractionResults.filter(result => result.extractionStatus === 'failed');
        const successfulFiles = extractionResults.filter(result => result.extractionStatus === 'success');
        
        if (allMenuItems.length > 0) {
          try {
            console.log('Auto-saving extracted menu items to database...');
            setSuccess('Saving menu items to database...');
            setProcessing(true); // Show loading state during save
            const saveResponse = await apiClient.bulkSaveMenuItems(restaurantId, allMenuItems);
            
            if (saveResponse.savedCount > 0) {
              // Create detailed success message
              let successMessage = `✅ ${saveResponse.savedCount} menu items extracted and saved successfully!`;
              
              if (successfulFiles.length > 0) {
                successMessage += `\n📄 Files processed: ${successfulFiles.map(f => f.file).join(', ')}`;
              }
              
              if (noMenuDataFiles.length > 0) {
                successMessage += `\n⚠️ No menu data found in: ${noMenuDataFiles.map(f => f.file).join(', ')}`;
              }
              
              if (failedFiles.length > 0) {
                successMessage += `\n❌ Failed to process: ${failedFiles.map(f => f.file).join(', ')}`;
              }
              
              setSuccess(successMessage);
              
              // Refresh the menu page
              onMenuItemsAdded && onMenuItemsAdded();
              
              // Close modal after a short delay
              setTimeout(() => {
                onClose();
                resetForm();
              }, 3000);
            } else {
              setError('Failed to save menu items to database. Please try again.');
            }
          } catch (saveError) {
            console.error('Auto-save error:', saveError);
            setError(`Menu items extracted but failed to save: ${saveError.message}`);
            setPreviewMode(true); // Show preview as fallback
            setSuccess('Menu items extracted successfully. You can review and save them manually below.');
          } finally {
            setProcessing(false); // Reset processing state
          }
        } else {
          // No menu items found in any file
          let errorMessage = 'No menu data found in any of the uploaded files.\n\n';
          
          if (noMenuDataFiles.length > 0) {
            errorMessage += `Files with no menu data:\n${noMenuDataFiles.map(f => `• ${f.file}: ${f.message}`).join('\n')}\n\n`;
          }
          
          if (failedFiles.length > 0) {
            errorMessage += `Files that failed to process:\n${failedFiles.map(f => `• ${f.file}: ${f.message}`).join('\n')}\n\n`;
          }
          
          errorMessage += 'Please try uploading:\n• Clear menu images\n• PDF files with menu content\n• Document files with menu data';
          
          setError(errorMessage);
        }
      } else {
        setError('No menu items were extracted from the uploaded files. Please try with clearer menu images.');
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Upload failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        switch (errorData.errorType) {
          case 'STORAGE_ERROR':
            errorMessage = 'Failed to upload files to storage. Please check your connection and try again.';
            break;
          case 'AI_SERVICE_ERROR':
            errorMessage = 'AI service is currently unavailable. Please try again later or contact support.';
            break;
          case 'PERMISSION_ERROR':
            errorMessage = 'You don\'t have permission to upload files. Please contact your administrator.';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Network error occurred. Please check your connection and try again.';
            break;
          default:
            errorMessage = errorData.error || errorData.message || 'An unexpected error occurred';
        }
      } else if (error.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveMenuItems = async () => {
    if (selectedItems.length === 0) {
      setError('Please select items to save');
      return;
    }

    try {
      setProcessing(true);
      setError('');

      const response = await apiClient.bulkSaveMenuItems(restaurantId, selectedItems);

      if (response.success === false) {
        setError(response.error || 'Save failed');
        return;
      }

      if (response.savedCount > 0) {
        setSuccess(`Successfully saved ${response.savedCount} menu items!`);
        onMenuItemsAdded && onMenuItemsAdded();
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        setError('No items were saved. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      
      let errorMessage = 'Save failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        errorMessage = errorData.error || errorData.message || 'Failed to save menu items';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditItem = (item, fileIndex, itemIndex) => {
    setEditingItem({ ...item, fileIndex, itemIndex });
  };

  const handleUpdateItem = (updatedItem) => {
    setExtractedMenus(prev => {
      const newMenus = [...prev];
      newMenus[updatedItem.fileIndex].menuItems[updatedItem.itemIndex] = updatedItem;
      return newMenus;
    });
    setEditingItem(null);
  };

  const handleSelectItem = (fileIndex, itemIndex, item) => {
    const itemKey = `${fileIndex}-${itemIndex}`;
    setSelectedItems(prev => {
      if (prev.some(selected => selected.key === itemKey)) {
        return prev.filter(selected => selected.key !== itemKey);
      } else {
        return [...prev, { ...item, key: itemKey, fileIndex, itemIndex }];
      }
    });
  };

  const resetForm = () => {
    setUploadedFiles([]);
    setExtractedMenus([]);
    setSelectedItems([]);
    setEditingItem(null);
    setPreviewMode(false);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) {
      return <FaImage size={16} style={{ color: '#3b82f6' }} />;
    } else if (mimetype === 'application/pdf') {
      return <FaFilePdf size={16} style={{ color: '#ef4444' }} />;
    }
    return <FaUpload size={16} style={{ color: '#6b7280' }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        width: '100%',
        maxWidth: previewMode ? '1200px' : '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #fed7aa'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📤 Bulk Menu Upload
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Upload menu images/PDFs and extract menu items using AI
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px' }}>
          {!previewMode ? (
            // Upload Step
            <div>
              {/* File Upload Area */}
              <div style={{
                border: '3px dashed #fed7aa',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                marginBottom: '24px',
                backgroundColor: '#fef7f0',
                transition: 'all 0.3s ease'
              }}>
                <FaUpload size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Upload Menu Files
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  Drag & drop or click to upload any file type: images, PDFs, documents, CSV, Excel, live photos (Max 10 files, 300MB total)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileSelect}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #fed7aa',
                    borderRadius: '12px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Selected Files ({uploadedFiles.length})
                  </h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {getFileIcon(file.type)}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                              {file.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleClose}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadAndExtract}
                  disabled={uploadedFiles.length === 0 || processing}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: processing ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {processing ? <FaSpinner className="animate-spin" size={14} /> : <FaUpload size={14} />}
                  {processing ? 'Processing...' : 'Upload & Extract'}
                </button>
              </div>
            </div>
          ) : (
            // Preview Step
            <div>
              {/* Success Message */}
              {success && (
                <div style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  border: '1px solid #22c55e',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)'
                }}>
                  <div style={{
                    backgroundColor: '#22c55e',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <FaCheckCircle size={12} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      Upload Successful
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                      {success}
                    </div>
                    {success.includes('saved') && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#15803d', 
                        marginTop: '8px',
                        fontStyle: 'italic'
                      }}>
                        Menu items are now available on your menu page.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted Menu Items */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Extracted Menu Items ({extractedMenus.reduce((total, menu) => total + menu.menuItems.length, 0)})
                  </h4>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {selectedItems.length} selected
                  </div>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {extractedMenus.map((menu, fileIndex) => (
                    <div key={fileIndex} style={{ marginBottom: '24px' }}>
                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getFileIcon('image/jpeg')}
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                            {menu.file} ({menu.menuItems.length} items)
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: '8px' }}>
                        {menu.menuItems.map((item, itemIndex) => {
                          const isSelected = selectedItems.some(selected => selected.key === `${fileIndex}-${itemIndex}`);
                          return (
                            <div key={itemIndex} style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '12px 16px',
                              backgroundColor: isSelected ? '#dbeafe' : 'white',
                              border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => handleSelectItem(fileIndex, itemIndex, item)}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectItem(fileIndex, itemIndex, item)}
                                style={{ marginRight: '12px' }}
                              />
                              
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                                    {item.name}
                                  </span>
                                  <span style={{
                                    backgroundColor: item.isVeg ? '#dcfce7' : '#fecaca',
                                    color: item.isVeg ? '#166534' : '#dc2626',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '600'
                                  }}>
                                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                                  </span>
                                  <span style={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#6b7280',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '500'
                                  }}>
                                    {item.category}
                                  </span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                  {item.description || 'No description'}
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', marginRight: '12px' }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ef4444' }}>
                                  ₹{item.price}
                                </div>
                                <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                  {item.shortCode}
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditItem(item, fileIndex, itemIndex);
                                }}
                                style={{
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 8px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                <FaEdit size={10} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setPreviewMode(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleSaveMenuItems}
                  disabled={selectedItems.length === 0 || processing}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: processing ? '#d1d5db' : '#10b981',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {processing ? <FaSpinner className="animate-spin" size={14} /> : <FaSave size={14} />}
                  {processing ? 'Saving...' : `Save ${selectedItems.length} Items`}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '16px',
              borderRadius: '12px',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              border: '1px solid #fecaca',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
            }}>
              <div style={{
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <FaExclamationTriangle size={12} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  Upload Error
                </div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                  {error}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#991b1b', 
                  marginTop: '8px',
                  fontStyle: 'italic',
                  marginBottom: '12px'
                }}>
                  Please try again or contact support if the problem persists.
                </div>
                <button
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setPreviewMode(false);
                    setExtractedMenus([]);
                    setSelectedItems([]);
                  }}
                  style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#b91c1c';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                  }}
                >
                  <FaUpload size={10} />
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkMenuUpload;

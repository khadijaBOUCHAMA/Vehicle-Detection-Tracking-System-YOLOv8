import React, { useState } from 'react'
import { processImage, processVideoTracking, downloadVideo } from './api'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [trackingResults, setTrackingResults] = useState(null)
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
    setTrackingResults(null)
    setProcessedImage(null)
  }

  const handleImageProcess = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    try {
      const result = await processImage(selectedFile)
      if (result.success) {
        setProcessedImage(`data:image/jpeg;base64,${result.processed_image}`)
        setDetections(result.detections)
        setTrackingResults(null)
      }
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoTracking = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    try {
      const result = await processVideoTracking(selectedFile)
      if (result.success) {
        setTrackingResults(result)
        setProcessedImage(`data:image/jpeg;base64,${result.preview_image}`)
      }
    } catch (error) {
      console.error('Error processing video:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadVideo = async () => {
    if (trackingResults?.processed_video) {
      try {
        await downloadVideo(trackingResults.processed_video)
      } catch (error) {
        console.error('Error downloading video:', error)
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>YOLO11 Autonomous Driving</h1>
        <p>Vehicle Tracking & Counting System</p>
      </header>

      <main className="main-content">
        <div className="upload-section">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          <div className="button-group">
            <button 
              onClick={handleImageProcess} 
              disabled={!selectedFile || loading}
              className="process-btn"
            >
              {loading ? 'Processing...' : 'Process Image'}
            </button>
            
            <button 
              onClick={handleVideoTracking} 
              disabled={!selectedFile || loading}
              className="process-btn tracking-btn"
            >
              {loading ? 'Tracking...' : 'Track & Count Vehicles'}
            </button>
          </div>
        </div>

        {trackingResults && (
          <div className="tracking-results">
            <div className="results-header">
              <h3>Vehicle Tracking Results</h3>
              <div className="count-summary">
                <p>Total Vehicles: <strong>{trackingResults.total_vehicles}</strong></p>
                <button 
                  onClick={handleDownloadVideo}
                  className="download-btn"
                >
                  Download Processed Video
                </button>
              </div>
            </div>

            <div className="results-section">
              <div className="image-container">
                <h4>Processed Frame Preview</h4>
                {processedImage && (
                  <img src={processedImage} alt="Processed" className="processed-image" />
                )}
              </div>
              
              <div className="counts-container">
                <h4>Vehicle Counts</h4>
                <div className="counts-grid">
                  {Object.entries(trackingResults.final_counts).map(([vehicle, count]) => (
                    <div key={vehicle} className="count-item">
                      <span className="vehicle-name">{vehicle}</span>
                      <span className="vehicle-count">{count}</span>
                    </div>
                  ))}
                </div>
                {trackingResults.total_vehicles === 0 && (
                  <p className="no-vehicles">No vehicles detected crossing the line</p>
                )}
              </div>
            </div>
          </div>
        )}

        {processedImage && !trackingResults && (
          <div className="results-section">
            <div className="image-container">
              <h3>Processed Image</h3>
              <img src={processedImage} alt="Processed" className="processed-image" />
            </div>
            
            {detections.length > 0 && (
              <div className="detections-container">
                <h3>Detections</h3>
                <table className="detections-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Confidence</th>
                      <th>Bounding Box</th>
                      <th>Track ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((det, index) => (
                      <tr key={index}>
                        <td>{det.class_name}</td>
                        <td>{(det.confidence * 100).toFixed(2)}%</td>
                        <td>{det.bbox.map(coord => coord.toFixed(2)).join(', ')}</td>
                        <td>{det.tracker_id || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [userName, setUserName] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  // Check backend connection on load
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('http://localhost:8000', { timeout: 5000 });
        if (response.data) {
          setBackendStatus("connected");
          console.log("Backend connected!");
        }
      } catch (error) {
        console.error("Backend not reachable:", error);
        setBackendStatus("disconnected");
      }
    };
    checkBackend();
  }, []);

  const onSubmit = async (data) => {
    setMessage(null);
    
    if (!userName.trim()) {
      setMessage({ type: "error", text: "Please enter your name first" });
      return;
    }
    
    if (!data.file || data.file.length === 0) {
      setMessage({ type: "error", text: "Please select a file" });
      return;
    }

    const file = data.file[0];
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Only JPEG, PNG, and PDF files are allowed" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", userName);

    setUploading(true);
    setUploadProgress(0);

    try {
      console.log("Sending to backend...");
      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      console.log("Response:", response.data);
      
      if (response.data.success || response.data.message) {
        setMessage({ 
          type: "success", 
          text: `✅ File uploaded successfully by ${userName}!` 
        });
        reset();
        setUploadProgress(0);
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      
      let errorMessage = "";
      if (error.code === "ERR_NETWORK") {
        errorMessage = "❌ Cannot connect to backend! Make sure Express server is running on http://localhost:8000";
      } else if (error.response) {
        errorMessage = `❌ ${error.response.data?.error || "Upload failed"}`;
      } else {
        errorMessage = `❌ Upload failed: ${error.message}`;
      }
      
      setMessage({ type: "error", text: errorMessage });
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1>File Upload Application</h1>
      
      {/* Backend Status */}
      <div style={{ 
        marginBottom: "20px", 
        padding: "10px", 
        borderRadius: "5px",
        backgroundColor: backendStatus === "connected" ? "#d4edda" : backendStatus === "checking" ? "#e7f3ff" : "#f8d7da",
        border: `1px solid ${backendStatus === "connected" ? "#c3e6cb" : backendStatus === "checking" ? "#b3d4fc" : "#f5c6cb"}`,
        color: backendStatus === "connected" ? "#155724" : backendStatus === "checking" ? "#004085" : "#721c24"
      }}>
        <strong>🔌 Backend Status:</strong> {
          backendStatus === "connected" ? "✅ Connected on http://localhost:8000" : 
          backendStatus === "checking" ? "⏳ Checking connection..." : 
          "❌ Not connected - Start backend with 'node server.js'"
        }
      </div>
      
      <div style={{ 
        marginBottom: "20px", 
        padding: "15px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "5px",
        border: "1px solid #dee2e6"
      }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Enter Your Name:
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Type your name here..."
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box"
          }}
        />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            {...register("file")}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            disabled={uploading}
            style={{ padding: "10px" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={uploading || backendStatus !== "connected"}
          style={{
            padding: "10px 20px",
            backgroundColor: (uploading || backendStatus !== "connected") ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: (uploading || backendStatus !== "connected") ? "not-allowed" : "pointer",
            fontSize: "16px"
          }}
        >
          {uploading ? "Uploading..." : backendStatus !== "connected" ? "Waiting for Backend..." : "Upload File"}
        </button>
      </form>

      {uploading && uploadProgress > 0 && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ 
            width: "100%", 
            backgroundColor: "#f0f0f0", 
            borderRadius: "5px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${uploadProgress}%`,
              backgroundColor: "#28a745",
              padding: "10px 0",
              textAlign: "center",
              color: "white",
              transition: "width 0.3s ease"
            }}>
              {uploadProgress}%
            </div>
          </div>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: "20px",
          padding: "12px",
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24",
          borderRadius: "5px",
          border: `1px solid ${message.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
          fontWeight: "bold"
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}
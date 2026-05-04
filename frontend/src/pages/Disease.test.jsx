import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Disease from './Disease';

// Mock axios
vi.mock('axios');

describe('Disease Detection Component DOM Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state correctly', () => {
    render(<Disease />);
    
    // Check header
    expect(screen.getByText('Leaf Disease Detection')).toBeInTheDocument();
    
    // Check initial upload section
    expect(screen.getByText('Analyze New Leaf')).toBeInTheDocument();
    expect(screen.getByText('Upload a leaf image to start')).toBeInTheDocument();
    
    // Check that start button is disabled initially
    const startButton = screen.getByRole('button', { name: /start ai pipeline/i });
    expect(startButton).toBeDisabled();
  });

  it('allows file selection and enables start button', async () => {
    render(<Disease />);
    
    const fileInput = document.querySelector('#leaf-upload');
    const file = new File(['dummy content'], 'tea_leaf.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('Selected: tea_leaf.png')).toBeInTheDocument();
    });
    
    const startButton = screen.getByRole('button', { name: /start ai pipeline/i });
    expect(startButton).not.toBeDisabled();
  });

  it('handles the AI pipeline flow when valid leaf is uploaded', async () => {
    // Mock successful API response
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          isLeaf: true,
          isHealthy: false,
          disease: 'Blister Blight',
          severity: 'High',
          confidence: '95.2',
          recommendation: 'Apply fungicide immediately.'
        }
      }
    });

    render(<Disease />);
    
    // Select file
    const fileInput = document.querySelector('#leaf-upload');
    const file = new File(['dummy content'], 'tea_leaf.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Wait for file selection to be processed
    await waitFor(() => {
      expect(screen.getByText('Selected: tea_leaf.png')).toBeInTheDocument();
    });

    // Click Start
    const startButton = screen.getByRole('button', { name: /start ai pipeline/i });
    fireEvent.click(startButton);
    
    // Check if axios was called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    // The component has `await new Promise(r => setTimeout(r, 1500))`
    // between steps, so we need to increase timeout for `findByText` or `waitFor`
    // Step 1: Identification
    expect(await screen.findByText(/Model 1: Leaf Identification/i, {}, { timeout: 3000 })).toBeInTheDocument();
    
    // Step 2: Health Assessment
    expect(await screen.findByText(/Model 2: Health Assessment/i, {}, { timeout: 3000 })).toBeInTheDocument();
    
    // Step 3: Disease Analysis
    expect(await screen.findByText(/Model 3: Disease & Severity/i, {}, { timeout: 3000 })).toBeInTheDocument();
    
    // Final Result - Wait for the Treatment Plan which is unique to the report card
    expect(await screen.findByText(/Treatment Plan/i, {}, { timeout: 8000 })).toBeInTheDocument();
    
    const reportCard = screen.getByClassName ? document.querySelector('.final-report-card') : screen.getByText(/Treatment Plan/i).closest('.final-report-card');
    
    expect(reportCard).toHaveTextContent(/Blister Blight/i);
    expect(reportCard).toHaveTextContent(/High Severity/i);
    expect(reportCard).toHaveTextContent(/Apply fungicide immediately/i);
  }, 10000); // increase jest timeout for this test
});

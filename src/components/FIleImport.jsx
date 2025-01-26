import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { Upload } from 'lucide-react';

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state for validation message
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal state for confirm delete
  const [deleteRowIndex, setDeleteRowIndex] = useState(null); // Row index to delete
  const rowsPerPage = 10;

  // Validation function
  const validateRowData = (row) => {
    const name = row[0];  // Assuming name is in the first column
    const amount = row[1];  // Assuming amount is in the second column
    const date = row[2];  // Assuming date is in the third column

    const currentMonth = new Date().getMonth();
    const rowDate = new Date(date);

    if (!name || amount <= 0 || rowDate.getMonth() !== currentMonth) {
      return false;
    }

    return true;
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const response = await axios.post('https://finexo-backend.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSheetNames(response.data.sheetNames);
      setSelectedSheet(response.data.sheetNames[0]);
      fetchSheetData(response.data.sheetNames[0]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchSheetData = async (sheetName) => {
    try {
      const response = await axios.get(`https://finexo-backend.onrender.com/api/data/${sheetName}`);
      setTableData(response.data.data);
      setHeaders(response.data.data[0] || []);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
    }
  };

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    fetchSheetData(sheetName);
  };

  const handleRowEdit = (rowIndex) => {
    setEditRowIndex(rowIndex);
    setEditRowData([...tableData[rowIndex]]);
  };

  const handleRowEditChange = (value, cellIndex) => {
    const updatedRow = [...editRowData];
    updatedRow[cellIndex] = value;
    setEditRowData(updatedRow);
  };

  const saveEditedRow = async () => {
    if (!validateRowData(editRowData)) {
      setShowModal(true);  // Show modal if validation fails
      return;
    }

    try {
      await axios.put('https://finexo-backend.onrender.com/api/data', {
        sheetName: selectedSheet,
        rowIndex: editRowIndex,
        updatedRow: editRowData,
      });
      const updatedData = [...tableData];
      updatedData[editRowIndex] = editRowData;
      setTableData(updatedData);
      setEditRowIndex(null);
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };

  const handleRowDelete = (rowIndex) => {
    setDeleteRowIndex(rowIndex);  // Set the row index to be deleted
    setShowConfirmModal(true);  // Show confirmation modal
  };

  const confirmDeleteRow = async () => {
    try {
      await axios.delete(`https://finexo-backend.onrender.com/api/data/${selectedSheet}/${deleteRowIndex}`);
      const updatedData = tableData.filter((_, index) => index !== deleteRowIndex);
      setTableData(updatedData);
      setShowConfirmModal(false); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false); // Close the confirmation modal
  };

  const handleRowCreate = async (newRow) => {
    if (!validateRowData(newRow)) {
      setShowModal(true);  // Show modal if validation fails
      return;
    }

    try {
      await axios.post('https://finexo-backend.onrender.com/api/data', {
        sheetName: selectedSheet,
        newRow,
      });
      setTableData([newRow, ...tableData]);
    } catch (error) {
      console.error('Error adding new row:', error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Export to Excel function
  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);  // Convert data to sheet format
    const wb = XLSX.utils.book_new();  // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, selectedSheet);  // Append sheet to workbook
    XLSX.writeFile(wb, `${selectedSheet}_export.xlsx`);  // Export the file
  };

  return (
    <div className="p-8 bg-gray-100">
         <div className="bg-gradient-to-r from-white to-gray-50 shadow-xl rounded-2xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="text-blue-500 w-8 h-8" />
        Upload Excel File
      </h2>

      <div
        className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl flex flex-col items-center justify-center p-6 mb-6 hover:bg-blue-100 transition cursor-pointer"
        onClick={() => document.getElementById("fileInput").click()}
        onDrop={handleFileUpload}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-12 h-12 text-blue-500 mb-3" />
        <p className="text-lg font-medium text-gray-600">
          Drag and drop your file here, or <span className="text-blue-500 underline">browse</span>
        </p>
        <input
          id="fileInput"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {sheetNames.length > 0 && (
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-600 mb-2">Select Sheet</label>
          <select
            value={selectedSheet}
            onChange={(e) => handleSheetChange(e.target.value)}
            className="block w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition shadow-sm hover:border-blue-400"
          >
            {sheetNames.map((sheet) => (
              <option key={sheet} value={sheet}>{sheet}</option>
            ))}
          </select>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-2">
        Supported formats: <strong>.xlsx, .xls</strong>
      </div>
    </div>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Data Table</h2>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        >
          Export to Excel
        </button>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th key={index} className="border px-4 py-2 text-left text-gray-600">{header}</th>
              ))}
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-4 py-2 text-gray-700">{cell}</td>
                ))}
                <td className="border px-4 py-2 text-gray-600 flex space-x-2">
                  <button
                    onClick={() => handleRowEdit(rowIndex)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRowDelete(rowIndex)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for validation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Validation Error</h2>
            <p className="mb-4 text-gray-600">Please ensure that the Name, Amount (greater than 0), and Date (current month) are provided correctly.</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-red-500 mb-4">Confirm Deletion</h2>
            <p className="mb-4 text-gray-600">Are you sure you want to delete this row?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeleteRow}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Row Modal */}
      {editRowIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Row</h2>
            {headers.map((header, cellIndex) => (
              <div key={cellIndex} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{header}</label>
                <input
                  type="text"
                  value={editRowData[cellIndex] || ''}
                  onChange={(e) => handleRowEditChange(e.target.value, cellIndex)}
                  className="block w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <div className="flex space-x-4 justify-end">
              <button
                onClick={saveEditedRow}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setEditRowIndex(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;

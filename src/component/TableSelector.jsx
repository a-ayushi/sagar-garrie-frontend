import { useState } from 'react';
import './TableSelector.css';

const TableSelector = ({ selectedTable, onTableSelect, selectedDate, selectedTime }) => {
  const [hoveredTable, setHoveredTable] = useState(null);

  // Mock data for table availability - in real app, this would come from API
  const tableAvailability = {
    '2024-01-15': {
      '12:00 PM': {
        1: { available: true, bookingTime: null },
        2: { available: false, bookingTime: '11:30 AM - 1:00 PM', customerName: 'John Doe' },
        3: { available: true, bookingTime: null },
        4: { available: true, bookingTime: null },
        5: { available: false, bookingTime: '12:00 PM - 2:00 PM', customerName: 'Sarah Smith' },
        6: { available: true, bookingTime: null },
        7: { available: true, bookingTime: null },
        8: { available: false, bookingTime: '11:00 AM - 1:30 PM', customerName: 'Mike Johnson' },
        9: { available: true, bookingTime: null },
        10: { available: true, bookingTime: null },
        11: { available: true, bookingTime: null },
        12: { available: false, bookingTime: '12:30 PM - 2:30 PM', customerName: 'Lisa Brown' },
        13: { available: true, bookingTime: null },
        14: { available: true, bookingTime: null },
        15: { available: true, bookingTime: null },
        16: { available: false, bookingTime: '11:45 AM - 1:45 PM', customerName: 'David Wilson' }
      }
    }
  };

  const getTableAvailability = (tableId) => {
    if (!selectedDate || !selectedTime) return { available: true, bookingTime: null };
    
    const dateKey = selectedDate;
    const timeKey = selectedTime;
    
    if (tableAvailability[dateKey] && tableAvailability[dateKey][timeKey]) {
      return tableAvailability[dateKey][timeKey][tableId] || { available: true, bookingTime: null };
    }
    
    return { available: true, bookingTime: null };
  };

  const tables = [
    // Window Tables (Premium)
    { id: 1, name: 'Table 1', capacity: 2, type: 'window', position: { row: 1, col: 1 } },
    { id: 2, name: 'Table 2', capacity: 4, type: 'window', position: { row: 1, col: 2 } },
    { id: 3, name: 'Table 3', capacity: 2, type: 'window', position: { row: 1, col: 3 } },
    { id: 4, name: 'Table 4', capacity: 6, type: 'window', position: { row: 1, col: 4 } },
    
    // Center Tables
    { id: 5, name: 'Table 5', capacity: 4, type: 'center', position: { row: 2, col: 1 } },
    { id: 6, name: 'Table 6', capacity: 2, type: 'center', position: { row: 2, col: 2 } },
    { id: 7, name: 'Table 7', capacity: 4, type: 'center', position: { row: 2, col: 3 } },
    { id: 8, name: 'Table 8', capacity: 8, type: 'center', position: { row: 2, col: 4 } },
    
    // Garden View Tables
    { id: 9, name: 'Table 9', capacity: 2, type: 'garden', position: { row: 3, col: 1 } },
    { id: 10, name: 'Table 10', capacity: 4, type: 'garden', position: { row: 3, col: 2 } },
    { id: 11, name: 'Table 11', capacity: 2, type: 'garden', position: { row: 3, col: 3 } },
    { id: 12, name: 'Table 12', capacity: 6, type: 'garden', position: { row: 3, col: 4 } },
    
    // Private Tables
    { id: 13, name: 'Table 13', capacity: 4, type: 'private', position: { row: 4, col: 1 } },
    { id: 14, name: 'Table 14', capacity: 6, type: 'private', position: { row: 4, col: 2 } },
    { id: 15, name: 'Table 15', capacity: 4, type: 'private', position: { row: 4, col: 3 } },
    { id: 16, name: 'Table 16', capacity: 8, type: 'private', position: { row: 4, col: 4 } }
  ];

  const renderTable = (table) => {
    const availability = getTableAvailability(table.id);
    const isSelected = selectedTable === table.id;
    const isHovered = hoveredTable === table.id;
    const isAvailable = availability.available;

    return (
      <div
        key={table.id}
        className={`table-item ${table.type} ${isSelected ? 'selected' : ''} ${!isAvailable ? 'booked' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={() => isAvailable && onTableSelect(table.id)}
        onMouseEnter={() => setHoveredTable(table.id)}
        onMouseLeave={() => setHoveredTable(null)}
      >
        <div className="table-number">{table.id}</div>
        <div className="table-capacity">{table.capacity} seats</div>
        
        {!isAvailable && (
          <div className="booked-overlay">
            <svg className="booked-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {isSelected && (
          <div className="selected-indicator">
            <svg className="selected-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Tooltip */}
        {isHovered && !isAvailable && (
          <div className="table-tooltip">
            <div className="tooltip-header">Table {table.id} - Booked</div>
            <div className="tooltip-content">
              <div className="tooltip-time">{availability.bookingTime}</div>
              <div className="tooltip-customer">Customer: {availability.customerName}</div>
            </div>
          </div>
        )}
        
        {isHovered && isAvailable && (
          <div className="table-tooltip available">
            <div className="tooltip-header">Table {table.id} - Available</div>
            <div className="tooltip-content">
              <div className="tooltip-capacity">{table.capacity} seats</div>
              <div className="tooltip-type">{table.type.charAt(0).toUpperCase() + table.type.slice(1)} view</div>
              <div className="tooltip-action">Click to select</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="table-selector">
      <div className="table-selector-header">
        <h3>Select Your Table</h3>
        <p>Choose your preferred table from the restaurant layout</p>
      </div>

      <div className="table-legend">
        <div className="legend-item">
          <div className="legend-color window"></div>
          <span>Window View</span>
        </div>
        <div className="legend-item">
          <div className="legend-color center"></div>
          <span>Center</span>
        </div>
        <div className="legend-item">
          <div className="legend-color garden"></div>
          <span>Garden View</span>
        </div>
        <div className="legend-item">
          <div className="legend-color private"></div>
          <span>Private</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="restaurant-layout">
        {/* Restaurant Background */}
        <div className="restaurant-background">
          <div className="entrance">Entrance</div>
          <div className="kitchen">Kitchen</div>
          <div className="garden">Garden View</div>
        </div>

        {/* Tables Grid */}
        <div className="tables-grid">
          {tables.map(renderTable)}
        </div>
      </div>

      {selectedTable && (
        <div className="selected-table-info">
          <div className="selected-info-card">
            <h4>Selected Table {selectedTable}</h4>
            <div className="table-details">
              {(() => {
                const table = tables.find(t => t.id === selectedTable);
                return (
                  <>
                    <div className="detail-item">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">{table.capacity} seats</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{table.type.charAt(0).toUpperCase() + table.type.slice(1)} view</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Features:</span>
                      <span className="detail-value">
                        {table.type === 'window' && 'Natural lighting, Street view'}
                        {table.type === 'center' && 'Central location, Easy access'}
                        {table.type === 'garden' && 'Peaceful ambiance, Greenery view'}
                        {table.type === 'private' && 'Quiet atmosphere, Privacy'}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSelector;

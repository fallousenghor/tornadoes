// Employee Badge Component - Displays employee photo, info and QR code

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Colors } from '../../../constants/theme';
import type { Employee } from '../../../types';

interface EmployeeBadgeProps {
  employee: Employee;
  showQRCode?: boolean;
}

const EmployeeBadge: React.FC<EmployeeBadgeProps> = ({ 
  employee, 
  showQRCode = true 
}) => {
  // Generate QR code content
  const qrContent = `MATRICULE: ${employee.employeeNumber || employee.userId}\nNOM: ${employee.lastName}\nPRENOM: ${employee.firstName}\nEMAIL: ${employee.email}`;

  return (
    <div style={{
      background: Colors.bg,
      borderRadius: 12,
      padding: 20,
      maxWidth: 350,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: `1px solid ${Colors.border}`,
    }}>
      {/* Header with company name */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${Colors.border}`
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: 14, 
          fontWeight: 600, 
          color: Colors.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Tournadoes Job
        </h3>
        <p style={{ 
          margin: '4px 0 0', 
          fontSize: 10, 
          color: Colors.textMuted 
        }}>
          Badge d'identification
        </p>
      </div>

      {/* Employee Photo */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: 16 
      }}>
        {employee.photoUrl ? (
          <img 
            src={employee.photoUrl} 
            alt={`${employee.firstName} ${employee.lastName}`}
            style={{ 
              width: 100, 
              height: 100, 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: `3px solid ${Colors.accent}`
            }}
          />
        ) : (
          <div style={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            background: 'rgba(100, 140, 255, 0.15)', 
            border: `3px solid ${Colors.accent}`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 32, 
            fontWeight: 600, 
            color: Colors.accent,
          }}>
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
        )}
      </div>

      {/* Employee Info */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: 18, 
          fontWeight: 600, 
          color: Colors.text 
        }}>
          {employee.firstName} {employee.lastName}
        </h2>
        <p style={{ 
          margin: '4px 0 0', 
          fontSize: 13, 
          color: Colors.textMuted 
        }}>
          {employee.poste}
        </p>
        {employee.departmentId && (
          <p style={{ 
            margin: '2px 0 0', 
            fontSize: 11, 
            color: Colors.accent 
          }}>
            {employee.departmentId}
          </p>
        )}
      </div>

      {/* Matricule */}
      <div style={{ 
        textAlign: 'center', 
        padding: '8px 12px',
        background: 'rgba(100, 140, 255, 0.1)',
        borderRadius: 6,
        marginBottom: 16
      }}>
        <span style={{ 
          fontSize: 11, 
          color: Colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Matricule
        </span>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 700, 
          color: Colors.accent,
          fontFamily: 'monospace'
        }}>
          {employee.employeeNumber || employee.userId}
        </div>
      </div>

      {/* QR Code */}
      {showQRCode && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <QRCodeSVG
            value={qrContent}
            size={120}
            level={"M"}
            includeMargin={false}
            bgColor={Colors.bg}
            fgColor={Colors.text}
          />
          <p style={{ 
            margin: '8px 0 0', 
            fontSize: 9, 
            color: Colors.textMuted 
          }}>
            Scannez pour plus d'informations
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: 16,
        paddingTop: 12,
        borderTop: `1px solid ${Colors.border}`,
        textAlign: 'center'
      }}>
        <span style={{ 
          fontSize: 10, 
          color: Colors.textMuted 
        }}>
          {new Date().getFullYear()} - Tournadoes Job
        </span>
      </div>
    </div>
  );
};

export default EmployeeBadge;


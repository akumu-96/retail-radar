
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TransactionData } from '@/pages/Index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface FraudHeatmapProps {
  data: TransactionData[];
}

export const FraudHeatmap: React.FC<FraudHeatmapProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !data.length) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 8);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Group data by store location
    const storeData = data.reduce((acc, transaction) => {
      if (!transaction.StoreLocation) return acc;
      
      const key = `${transaction.StoreLocation.lat},${transaction.StoreLocation.lng}`;
      if (!acc[key]) {
        acc[key] = {
          location: transaction.StoreLocation,
          transactions: [],
          totalFraud: 0,
          highRisk: 0
        };
      }
      
      acc[key].transactions.push(transaction);
      if (transaction.fraudScore && transaction.fraudScore > 0.7) {
        acc[key].totalFraud++;
      }
      if (transaction.riskLevel === 'High') {
        acc[key].highRisk++;
      }
      
      return acc;
    }, {} as any);

    // Add markers for each store
    Object.values(storeData).forEach((store: any) => {
      const { location, transactions, totalFraud, highRisk } = store;
      const fraudRate = totalFraud / transactions.length;
      
      // Determine marker color based on fraud rate
      const getColor = () => {
        if (fraudRate > 0.5) return 'red';
        if (fraudRate > 0.3) return 'orange';
        if (fraudRate > 0.1) return 'yellow';
        return 'green';
      };

      const color = getColor();
      const radius = Math.max(8, Math.min(25, transactions.length * 2));

      const marker = L.circleMarker([location.lat, location.lng], {
        radius,
        fillColor: color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="font-family: system-ui; padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
            ${location.name}
          </h3>
          <div style="color: #4b5563; font-size: 14px; line-height: 1.4;">
            <div><strong>Total Transactions:</strong> ${transactions.length}</div>
            <div><strong>Flagged as Fraud:</strong> ${totalFraud}</div>
            <div><strong>High Risk:</strong> ${highRisk}</div>
            <div><strong>Fraud Rate:</strong> ${(fraudRate * 100).toFixed(1)}%</div>
          </div>
          <div style="margin-top: 8px; padding: 4px 8px; background: ${color}; color: white; border-radius: 4px; text-align: center; font-weight: 600; font-size: 12px;">
            ${fraudRate > 0.5 ? 'HIGH RISK' : fraudRate > 0.3 ? 'MEDIUM RISK' : fraudRate > 0.1 ? 'LOW RISK' : 'SECURE'}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  const fraudCount = data.filter(t => t.riskLevel === 'High').length;
  const storeCount = new Set(data.map(t => t.StoreLocation?.name)).size;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Geographic Fraud Hotspots</span>
        </CardTitle>
        <div className="flex space-x-4 text-sm">
          <div className="text-red-400">
            <span className="font-medium">{fraudCount}</span> High Risk
          </div>
          <div className="text-slate-400">
            <span className="font-medium">{storeCount}</span> Stores
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-80 rounded-lg border border-slate-600"
          style={{ minHeight: '320px' }}
        />
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-400">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-slate-400">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-400">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-400">High Risk</span>
            </div>
          </div>
          <p className="text-slate-500">Click markers for details</p>
        </div>
      </CardContent>
    </Card>
  );
};

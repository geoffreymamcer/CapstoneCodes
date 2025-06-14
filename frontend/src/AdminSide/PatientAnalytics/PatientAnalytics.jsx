import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Sample data - this would come from backend in real implementation
const eyeConditionData = [
  { name: "Myopia", value: 35 },
  { name: "Hyperopia", value: 20 },
  { name: "Astigmatism", value: 25 },
  { name: "Presbyopia", value: 15 },
  { name: "Cataracts", value: 5 },
];

const visitGrowthData = [
  { month: "Jan", visits: 120 },
  { month: "Feb", visits: 150 },
  { month: "Mar", visits: 180 },
  { month: "Apr", visits: 210 },
  { month: "May", visits: 240 },
  { month: "Jun", visits: 270 },
];

const ageGroupData = [
  { ageGroup: "0-18", patients: 50 },
  { ageGroup: "19-35", patients: 120 },
  { ageGroup: "36-50", patients: 180 },
  { ageGroup: "51-65", patients: 150 },
  { ageGroup: "65+", patients: 100 },
];

const geoData = [
  { id: "US-CA", name: "California", patients: 320 },
  { id: "US-TX", name: "Texas", patients: 180 },
  { id: "US-NY", name: "New York", patients: 210 },
  { id: "US-FL", name: "Florida", patients: 150 },
  { id: "US-IL", name: "Illinois", patients: 90 },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Color palette
const colors = {
  maroon: "#800000",
  lightMaroon: "#a04040",
  white: "#ffffff",
  lightGray: "#f5f5f5",
  text: "#333333",
};

// Custom Dropdown Component
const GraphDropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.dropdownContainer}>
      <div style={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        {selected}
        <span style={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div style={styles.dropdownList}>
          {options.map((option, index) => (
            <div
              key={index}
              style={styles.dropdownItem}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const PatientAnalytics = () => {
  const [selectedGraph, setSelectedGraph] = useState(
    "Eye Condition Distribution"
  );

  const graphOptions = [
    "Eye Condition Distribution",
    "Patient Visit Growth",
    "Patient Age Groups",
    "Patient Geographic Distribution",
  ];

  const renderSelectedGraph = () => {
    switch (selectedGraph) {
      case "Eye Condition Distribution":
        return <EyeConditionChart />;
      case "Patient Visit Growth":
        return <VisitGrowthChart />;
      case "Patient Age Groups":
        return <AgeGroupChart />;
      case "Patient Geographic Distribution":
        return <GeoMapChart />;
      default:
        return <EyeConditionChart />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <h1 style={styles.dashboardTitle}>Patient Analytics</h1>

      <div style={styles.dropdownWrapper}>
        <GraphDropdown
          options={graphOptions}
          selected={selectedGraph}
          onChange={setSelectedGraph}
        />
      </div>

      <div style={styles.graphContainer}>{renderSelectedGraph()}</div>

      <div style={styles.graphGrid}>
        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Eye Condition Distribution</h3>
          <EyeConditionChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Patient Visit Growth</h3>
          <VisitGrowthChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Patient Age Groups</h3>
          <AgeGroupChart />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Patient Geographic Distribution</h3>
          <GeoMapChart />
        </div>
      </div>
    </div>
  );
};

// Individual Chart Components
const EyeConditionChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={eyeConditionData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill={colors.maroon}
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {eyeConditionData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getShade(index, eyeConditionData.length)}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const VisitGrowthChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={visitGrowthData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.lightMaroon} />
        <XAxis dataKey="month" stroke={colors.maroon} />
        <YAxis stroke={colors.maroon} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="visits"
          stroke={colors.maroon}
          strokeWidth={3}
          activeDot={{ r: 8 }}
          name="Patient Visits"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const AgeGroupChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={ageGroupData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.lightMaroon} />
        <XAxis dataKey="ageGroup" stroke={colors.maroon} />
        <YAxis stroke={colors.maroon} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="patients"
          fill={colors.maroon}
          name="Number of Patients"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const GeoMapChart = () => {
  // Sample GeoJSON data for US states
  const geoJsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "California", patients: 320 },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              /* coordinates for California */
            ],
          ],
        },
      },
      // Add other states as needed
    ],
  };

  const getColor = (patients) => {
    if (patients >= 300) return "#5a0000";
    if (patients >= 200) return "#800000";
    if (patients >= 100) return "#a04040";
    return "#c08080";
  };

  const styleFeature = (feature) => {
    return {
      fillColor: getColor(feature.properties.patients),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={geoJsonData}
          style={styleFeature}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<b>${feature.properties.name}</b><br>Patients: ${feature.properties.patients}`
            );
          }}
        />
      </MapContainer>
    </div>
  );
};

// Helper functions
const getShade = (index, total) => {
  const baseColor = colors.maroon;
  const baseR = parseInt(baseColor.slice(1, 3), 16);
  const baseG = parseInt(baseColor.slice(3, 5), 16);
  const baseB = parseInt(baseColor.slice(5, 7), 16);

  // Calculate lighter shades
  const factor = 0.8 - (index / total) * 0.6;
  const r = Math.min(255, Math.floor(baseR + (255 - baseR) * factor));
  const g = Math.min(255, Math.floor(baseG + (255 - baseG) * factor));
  const b = Math.min(255, Math.floor(baseB + (255 - baseB) * factor));

  return `rgb(${r}, ${g}, ${b})`;
};

const getColorForPatients = (count) => {
  if (count >= 300) return "#5a0000";
  if (count >= 200) return "#800000";
  if (count >= 100) return "#a04040";
  return "#c08080";
};

// Styles
const styles = {
  dashboardContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: colors.white,
    color: colors.text,
    maxWidth: "1200px",
    margin: "0 auto",
  },
  dashboardTitle: {
    color: colors.maroon,
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
  },
  dropdownWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  dropdownContainer: {
    position: "relative",
    width: "300px",
  },
  dropdownHeader: {
    padding: "12px 15px",
    backgroundColor: colors.maroon,
    color: colors.white,
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "500",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  dropdownArrow: {
    fontSize: "12px",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightMaroon}`,
    borderRadius: "0 0 5px 5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    zIndex: "100",
  },
  dropdownItem: {
    padding: "12px 15px",
    cursor: "pointer",
    borderBottom: `1px solid ${colors.lightGray}`,
    transition: "background-color 0.2s",
  },
  dropdownItemHover: {
    backgroundColor: colors.lightGray,
  },
  graphContainer: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${colors.lightGray}`,
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  graphGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  graphCard: {
    backgroundColor: colors.white,
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    border: `1px solid ${colors.lightGray}`,
    height: "450px",
  },
  graphTitle: {
    color: colors.maroon,
    marginTop: "0",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "600",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: "350px",
  },
  mapLegend: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  legendColor: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
  },
};

export default PatientAnalytics;

const RelationMarkets = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <marker
          id="relation-one"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
            style={{
              stroke: "currentcolor",
              color: "#5c7194",
            }}
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            style={{
              stroke: "currentcolor",
              color: "#5c7194",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-one-selected"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            style={{
              stroke: "currentcolor",
              color: "white",
            }}
            strokeWidth="3"
            strokeLinecap="square"
            fill="none"
            points="-10,-8 -10,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            style={{
              stroke: "currentcolor",
              color: "white",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>

        <marker
          id="relation-many"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            style={{
              stroke: "currentcolor",
              color: "#5c7194",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            style={{
              stroke: "currentcolor",
              color: "#5c7194",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
        <marker
          id="relation-many-selected"
          markerWidth="12.5"
          markerHeight="12.5"
          viewBox="-10 -10 20 20"
          orient="auto-start-reverse"
          refX="-10"
          refY="0"
        >
          <polyline
            style={{
              stroke: "currentcolor",
              color: "white",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
            points="0,-8 -10,0 0,8"
          />
          <line
            x1="-8"
            y1="0"
            x2="0"
            y2="0"
            style={{
              stroke: "currentcolor",
              color: "white",
            }}
            strokeLinejoin="round"
            strokeLinecap="square"
            strokeWidth="1.5"
            fill="none"
          />
        </marker>
      </defs>
    </svg>
  );
};

export default RelationMarkets;

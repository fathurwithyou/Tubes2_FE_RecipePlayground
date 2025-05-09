import React, { useEffect, useState, useRef } from 'react';
import Tree, { RawNodeDatum, TreeNodeDatum } from 'react-d3-tree';

interface Element {
  name: string;
  recipes: string[][] | null;
  tier: number;
}

interface BackendData {
  elements: Element[];
}

interface TreeNode extends RawNodeDatum {
  name: string;
  children?: TreeNode[];
  tier?: number;
}

const buildTreeNode = (name: string, elementsMap: Map<string, Element>, visited = new Set<string>()): TreeNode => {
  if (visited.has(name)) {
    return { name };
  }
  visited.add(name);

  const element = elementsMap.get(name);
  if (!element || !element.recipes || element.recipes.length === 0) {
    return { name, tier: element?.tier };
  }

  // Flatten all ingredients from all recipes as children
  const childrenNames = new Set<string>();
  element.recipes.forEach(recipe => {
    recipe.forEach(childName => childrenNames.add(childName as string));
  });

  const children: TreeNode[] = Array.from(childrenNames).map(childName =>
    buildTreeNode(childName, elementsMap, new Set(visited))
  );

  return {
    name,
    tier: element.tier,
    children: children.length > 0 ? children : undefined,
  };
};

const transformDataToTree = (data: BackendData, rootName: string): TreeNode | null => {
  if (!data.elements || data.elements.length === 0) {
    return null;
  }

  const elementsMap = new Map<string, Element>();
  data.elements.forEach(el => elementsMap.set(el.name, el));

  const usedNames = new Set<string>();
  data.elements.forEach(el => {
    if (el.recipes) {
      el.recipes.forEach(recipe => {
        recipe.forEach(name => usedNames.add(name));
      });
    }
  });

  const roots = data.elements.filter(el => !usedNames.has(el.name));

  if (roots.length === 0) {
    return buildTreeNode(rootName, elementsMap);
  }

  if (roots.length === 1) {
    // Use rootName if it exists in elementsMap, else fallback to roots[0].name
    if (elementsMap.has(rootName)) {
      return buildTreeNode(rootName, elementsMap);
    } else {
      return buildTreeNode(roots[0].name, elementsMap);
    }
  } else {
    return {
      name: rootName,
      children: roots.map(root => buildTreeNode(root.name, elementsMap)),
    };
  }
};

const renderForeignObjectNode = ({
  nodeDatum,
}: {
  nodeDatum: TreeNodeDatum;
}) => {
  const backgroundColor = '#ffffff';

  return (
    <g>
      <rect
        width={120}
        height={40}
        x={-60}
        y={-20}
        fill={backgroundColor}
        stroke="#555"
        strokeWidth={1.5}
        rx={10}
        ry={10}
        style={{ userSelect: 'none' }}
      />
      <text fill="#333" strokeWidth={0.5} x={0} y={5} textAnchor="middle" style={{ userSelect: 'none' }}>
        {nodeDatum.name}
      </text>
    </g>
  );
};

interface RecipeTreeProps {
  data: BackendData;
  width?: number | string;
  height?: number;
  rootName?: string;
}

const RecipeTree: React.FC<RecipeTreeProps> = ({ data, width = 900, height = 600, rootName = 'Root' }) => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(typeof width === 'number' ? width : 900);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transformed = transformDataToTree(data, rootName);
    setTreeData(transformed);
  }, [data, rootName]);

  useEffect(() => {
    if (typeof width === 'string' && containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.contentRect) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    } else if (typeof width === 'number') {
      setContainerWidth(width);
    }
  }, [width]);

  if (!treeData) {
    return <div>No data to display</div>;
  }

  return (
    <div id="treeWrapper" ref={containerRef} style={{ width: typeof width === 'number' ? `${width}px` : width, height }}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: containerWidth / 2, y: 50 }}
        pathFunc="elbow"
        collapsible={false}
        zoomable={true}
        renderCustomNodeElement={renderForeignObjectNode}
        nodeSize={{ x: 180, y: 80 }}
      />
    </div>
  );
};

export default RecipeTree;

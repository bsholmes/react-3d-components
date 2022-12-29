export default function loader (text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  let min = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  let max = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
 
  // same order as `f` indices
  const objVertexData = [
    objPositions,
    objTexcoords,
    objNormals,
  ];
 
  // same order as `f` indices
  let webglVertexData = [
    [],   // positions
    [],   // texcoords
    [],   // normals
  ];
 
  const addVertex = (vert) => {

    const ptn = vert.split('/');
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);

      webglVertexData[i].push(...objVertexData[i][index]);
      min[0] = Math.min(min[0], objVertexData[i][index][0]);
      min[1] = Math.min(min[1], objVertexData[i][index][1]);
      min[2] = Math.min(min[2], objVertexData[i][index][2]);

      max[0] = Math.max(max[0], objVertexData[i][index][0]);
      max[1] = Math.max(max[1], objVertexData[i][index][1]);
      max[2] = Math.max(max[2], objVertexData[i][index][2]);
    });
  }
 
  const keywords = {
    v: (parts) => {
      objPositions.push(parts.map(parseFloat));
    },
    vn: (parts) => {
      objNormals.push(parts.map(parseFloat));
    },
    vt: (parts) => {
      objTexcoords.push(parts.map(parseFloat));
    },
    f: (parts) => {
      const numTriangles = parts.length - 2;
      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');
  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
      continue;
    }
    handler(parts, unparsedArgs);
  }

  return {
    position: webglVertexData[0],
    texcoord: webglVertexData[1],
    normal: webglVertexData[2],
    min,
    max
  };
}
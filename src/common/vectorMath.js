export const DEG_TO_RAD = 1 / 57.295779513;
export const RAD_TO_DEG = 57.295779513;

/**
 **************** VECTOR ****************
 */

export const vec4Dot = (left, right) => {
  let dProduct = 0;

	for(let i = 0; i < 4; ++i) {
    dProduct += (left[i] * right[i]);
  }
		
	return dProduct;
};

export const vec4Cross = (left, right) => {
  let tempVec = [];

	tempVec[0] = left[1] * right[2] - right[1] * left[2];
	tempVec[1] = left[2] * right[0] - right[2] * left[0];
	tempVec[2] = left[0] * right[1] - right[0] * left[1];
	tempVec[3] = 0;

	return tempVec;
};

export const vec4Add = (left, right) => {
  let tempVec = [];

	for(let i = 0; i < 4; ++i) {
		tempVec[i] = left[i] + right[i];
  }

	return tempVec;
};

export const vec4Sub = (left, right) => {
  let tempVec = [];

	for(let i = 0; i < 4; ++i) {
		tempVec[i] = left[i] - right[i];
  }

	return tempVec;
};

export const vec4Scale = (leftVec4, rightScalar) => {
  let tempVec = [];

	for(let i = 0; i < 4; ++i) {
		tempVec[i] = leftVec4[i] * rightScalar;
  }

	return tempVec;
};

export const vec4Magnitude = (vec4) => {
	return Math.sqrt(vec4Dot(vec4, vec4));
}

export const vec4Normalize = (vec4) => {
  return vec4Scale(vec4, 1 / vec4Magnitude(vec4));
};

/**
 **************** MATRIX ****************
 */

export const mat4Mult = (left, right) => {
  let tempMat = [];
	const n = 4;

	for (let i = 0; i < n; ++i) {
		for (let e = 0; e < n; ++e) {
			tempMat[i * n + e] = vec4Dot(
				[left[i * n], left[i * n + 1], left[i * n + 2], left[i * n + 3]],
				[right[e], right[e + n], right[e + n * 2], right[e + n * 3]]
			);
		}
	}

	return tempMat;
};

export const mat4Transpose = (mat4) => {
  let tempMat = [];

	for(let i = 0; i < 4; ++i) {
		for(let e = 0; e < 4; ++e) {
			tempMat[i + e * 4] = mat4[i * 4 + e];
    }
  }

	return tempMat;
};

export const IdentityMatrix = () => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
}

export const ViewMatrix = (camPos, targetPos, upDir) => {
  const z = vec4Normalize(vec4Sub(camPos, targetPos));
	const x = vec4Normalize(vec4Cross(z, upDir));
	const y = vec4Normalize(vec4Cross(z, vec4Scale(x, -1)));

  return [
    x[0], x[1], x[2], 0,
    y[0], y[1], y[2], 0,
    z[0], z[1], z[2], 0,
    -camPos[0], -camPos[1], -camPos[2], 1
  ];
};

export const ProjectionMatrix = (fovy, aspect, near, far) => {
  const f = 1 / Math.tan((fovy * DEG_TO_RAD) / 2);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, -(far + near) / (far - near), -1,
    0, 0, -(2 * far * near) / (far - near), 1
  ];
};

export const RotationMatrix = (angle, axisOfRotation) => {
  const angleRad = angle * DEG_TO_RAD;

  let rotMat = IdentityMatrix();

  const vN = vec4Normalize(axisOfRotation);
	const c = Math.cos(angleRad);
	const s = Math.sin(angleRad);
	const t = 1 - c;
	const x = vN[0];
	const y = vN[1];
	const z = vN[2];

	rotMat[0] = t * x * x + c;
	rotMat[1] = t * x * y - z * s;
	rotMat[2] = t * x * z + y * s;

	rotMat[4] = t * x * y + z * s;
	rotMat[5] = t * y * y + c;
	rotMat[6] = t * y * z - x * s;
  
	rotMat[8] = t * x * z - y * s;
	rotMat[9] = t * y * z + x * s;
	rotMat[10] = t * z * z + c;

	return rotMat;

  // if (axisOfRotation[0] !== 0 && axisOfRotation[1] === 0 && axisOfRotation === 0) {
  //   // Rotation around the X axis
  //   if (axisOfRotation[0] < 0) {
  //     s = -s;
  //   }

  //   matrix = [
  //     1, 0, 0, 0,
  //     0, c, -s, 0,
  //     0, s, c, 0,
  //     0, 0, 0, 1
  //   ];

  //   // M[0] = 1;  M[4] = 0;  M[8]  = 0;  M[12] = 0;
  //   // M[1] = 0;  M[5] = c;  M[9]  = -s; M[13] = 0;
  //   // M[2] = 0;  M[6] = s;  M[10] = c;  M[14] = 0;
  //   // M[3] = 0;  M[7] = 0;  M[11] = 0;  M[15] = 1;

  // } else if (axisOfRotation[0] === 0 && axisOfRotation[1] !== 0 && axisOfRotation === 0) {
  //   // Rotation around Y axis
  //   if (axisOfRotation[1] < 0) {
  //     s = -s;
  //   }

  //   matrix = [
  //     c, 0, s, 0,
  //     0, 1, 0, 0,
  //     -s, 0, c, 0,
  //     0, 0, 0, 1
  //   ];

  //   // M[0] = c;  M[4] = 0;  M[8]  = s;  M[12] = 0;
  //   // M[1] = 0;  M[5] = 1;  M[9]  = 0;  M[13] = 0;
  //   // M[2] = -s; M[6] = 0;  M[10] = c;  M[14] = 0;
  //   // M[3] = 0;  M[7] = 0;  M[11] = 0;  M[15] = 1;

  // } else if (axisOfRotation[0] === 0 && axisOfRotation[1] === 0 && axisOfRotation !== 0) {
  //   // Rotation around Z axis
  //   if (zAxis < 0) {
  //     s = -s;
  //   }

  //   matrix = [
  //     c, -s, 0, 0,
  //     s, c, 0, 0,
  //     0, 0, 1, 0,
  //     0, 0, 0, 1
  //   ];

  //   // M[0] = c;  M[4] = -s;  M[8]  = 0;  M[12] = 0;
  //   // M[1] = s;  M[5] = c;   M[9]  = 0;  M[13] = 0;
  //   // M[2] = 0;  M[6] = 0;   M[10] = 1;  M[14] = 0;
  //   // M[3] = 0;  M[7] = 0;   M[11] = 0;  M[15] = 1;

  // } else {
  //   // Rotation around any arbitrary axis
  //   let nAxis = vec4Normalize(axisOfRotation);
  //   ux = nAxis[0];
  //   uy = nAxis[1];
  //   uz = nAxis[2];

  //   c1 = 1 - c;

  //   matrix[0] = c + ux * ux * c1;
  //   matrix[1] = uy * ux * c1 + uz * s;
  //   matrix[2] = uz * ux * c1 - uy * s;
  //   matrix[3] = 0;

  //   matrix[4] = ux * uy * c1 - uz * s;
  //   matrix[5] = c + uy * uy * c1;
  //   matrix[6] = uz * uy * c1 + ux * s;
  //   matrix[7] = 0;

  //   matrix[8] = ux * uz * c1 + uy * s;
  //   matrix[9] = uy * uz * c1 - ux * s;
  //   matrix[10] = c + uz * uz * c1;
  //   matrix[11] = 0;

  //   matrix[12] = 0;
  //   matrix[13] = 0;
  //   matrix[14] = 0;
  //   matrix[15] = 1;
  // }

  // return matrix;
};

export const TranslationMatrix = (translateVec) => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    translateVec[0], translateVec[1], translateVec[2], 1
  ];
};

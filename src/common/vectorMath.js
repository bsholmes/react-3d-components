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

export const mat4Mult = (left, right) => {
  let tempMat = [];
	let rightT = mat4Transpose(right);
	for(let i = 0; i < 4; ++i) {
		for(let e = 0; e < 4; ++e) {
			tempMat[i + e * 4] = vec4Dot(
        [left[i], left[i + 1], left[i + 2], left[i + 3]],
        [rightT[e], rightT[e + 1], rightT[e + 2], rightT[e + 3]]);
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
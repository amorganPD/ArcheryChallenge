function CalculateProjectile(V0, X0, Y0, Z0, theta, phi, timeElapsed)
{
	var V1_X, V1_Y, V1_Z, X1, Y1, Z1;
	var g = 9.8;
	var dx, dy, dz;
	var theta1, phi1;

	dx = (V0 * Math.cos(theta) * Math.sin(phi)) * timeElapsed;
	dy = (V0 * ((Math.sin(theta) * Math.sin(phi)) * timeElapsed) - (g * 1/2 * Math.pow(timeElapsed,2)));
	dz = (V0 * Math.cos(phi) * timeElapsed);

	X1 = X0 + dx;
	Y1 = Y0 + dy;
	Z1 = Z0 + dz;

	V0_X = V0 * Math.cos(theta) * Math.sin(phi);
	V0_Y = V0 * Math.cos(theta) * Math.sin(phi);
	V0_Z = V0 * Math.cos(phi);
	V1_Y = V0_Y - (g * timeElapsed);

	finalV = Math.sqrt(Math.abs(Math.pow(V0_X, 2)) + Math.abs(Math.pow(V1_Y,2)) + Math.abs(Math.pow(V0_Z,2)));

	r = Math.sqrt(Math.abs(Math.pow(dx, 2)) + Math.abs(Math.pow(dy,2)) + Math.abs(Math.pow(dz,2)));

	theta1 = Math.atan(dy/dx);
	phi1 = Math.acos(dz/r);

	return {X: X1, Y: Y1, Z: Z1, V: finalV, theta: theta1, phi: phi1};
}

function cleanseRounding(value) {
	if (Math.abs(value) < .0000000001) {
		return 0;
	}
	else {
		return value;
	}
}
function translateAlongVector(x0, y0, z0, v0, t, theta0, phi0) {
  var Ax = 0.0;
  var Ay = 0; //-9.8/1000000;
  var Az = 0.0;

  var Vx_ = v0 * Math.cos(theta0) * Math.sin(phi0) + (Ax * t);
  var Vy_ = v0 * Math.sin(theta0) * Math.sin(phi0) + (Ay * t);
  var Vz_ = v0 * Math.cos(phi0) + (Az * t);

  var x1 = x0 + (Vx_ * t) + 0.5*(Ax * Math.pow(t, 2));
  var y1 = y0 + (Vy_ * t) + 0.5*(Ay * Math.pow(t, 2));
  var z1 = z0 + (Vz_ * t) + 0.5*(Az * Math.pow(t, 2));

  var v1 = Math.sqrt(Math.pow(Vx_, 2) + Math.pow(Vy_, 2) + Math.pow(Vz_, 2));

  var theta1 = Math.atan(Vy_ / Vx_);
  var phi1 = Math.acos(Vz_ / v1);
  // cleanse rounding error
  x1 = cleanseRounding(x1);
  y1 = cleanseRounding(y1);
  z1 = cleanseRounding(z1);
  v1 = cleanseRounding(v1);
  theta1 = cleanseRounding(theta1);
  phi1 = cleanseRounding(phi1);

  return {x: x1, y: y1, z: z1, v: v1, theta: theta1, phi: phi1};
  
}
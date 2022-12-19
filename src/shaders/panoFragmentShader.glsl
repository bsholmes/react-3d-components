uniform sampler2D tex2d; 

void main(void)
{
	vec4 texColor = texture2D(tex2d,(gl_TexCoord[0].st));
	gl_FragColor = texColor;
}

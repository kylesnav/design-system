// Delightful Design System — Warm Editorial Vignette
// ===================================================
// Subtle warm-tinted vignette around the edges — the "sunlight on paper" feel.

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 texColor = texture(iChannel0, uv);

    // Distance from center, aspect-corrected
    vec2 center = uv - 0.5;
    center.x *= iResolution.x / iResolution.y;
    float dist = length(center);

    // Smooth vignette
    float vignette = smoothstep(0.85, 0.4, dist);

    // Warm tint for darkened edges (amber/cream hue family)
    vec3 warmTint = vec3(0.98, 0.94, 0.88);
    vec3 result = mix(texColor.rgb * warmTint * 0.85, texColor.rgb, vignette);

    fragColor = vec4(result, texColor.a);
}

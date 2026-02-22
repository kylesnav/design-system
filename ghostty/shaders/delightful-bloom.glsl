// Delightful Design System — Soft Bloom
// ======================================
// Adds a very subtle warm bloom to bright elements (text, UI highlights).
// Makes the terminal feel like it's glowing softly — editorial magazine vibes.

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 texColor = texture(iChannel0, uv);

    // Sample surrounding pixels for bloom
    vec2 texel = 1.0 / iResolution.xy;
    float bloomRadius = 2.0;

    vec3 bloom = vec3(0.0);
    float total = 0.0;

    for (float x = -bloomRadius; x <= bloomRadius; x += 1.0) {
        for (float y = -bloomRadius; y <= bloomRadius; y += 1.0) {
            vec2 offset = vec2(x, y) * texel * 1.5;
            vec4 sample_color = texture(iChannel0, uv + offset);

            // Only bloom bright pixels (text and highlights)
            float brightness = dot(sample_color.rgb, vec3(0.299, 0.587, 0.114));
            float weight = smoothstep(0.3, 0.8, brightness);

            bloom += sample_color.rgb * weight;
            total += weight;
        }
    }

    if (total > 0.0) bloom /= total;

    // Very subtle additive bloom — warm tint
    vec3 warmBloom = bloom * vec3(1.0, 0.97, 0.93);
    vec3 result = texColor.rgb + warmBloom * 0.04;

    fragColor = vec4(result, texColor.a);
}

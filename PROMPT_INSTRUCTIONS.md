# VIBEWEAR AI Image Generation Prompt Instructions

## Current Prompt Engineering Strategy

### Base Style Prompts
Each style has detailed instructions to ensure consistency:

**Graffiti Style:**
```
Comic-style text logo. The word in large bold 3D bubble letters, bright green color with black outline and subtle inner shadow. Background with dripping red goo or paint behind the text. Graffiti-inspired, fun and playful style, slight cartoon texture, centered on a clean white background. No background noise, no extra elements. no images.
```

**Cyberpunk Style:**
```
Cyberpunk futuristic illustration with cinematic lighting and immersive depth. Dark neon-lit city environment with glowing signs, reflections on wet surfaces, mist and rain. Bright cyan, magenta, electric blue, and hot pink neon lights. Dynamic side lighting with strong shadows and color glow. Urban background with holographic billboards, flying particles, and futuristic architecture. Designed for bold print. No flat circuit patterns, no pure digital UI overlays, no abstract backgrounds. Focus on realistic lighting, depth, and cinematic composition.
```

**Comic:**
```
Manga comic style illustration, clean line art with bold outlines, flat bright colors, cel shading, simple backgrounds, high contrast, expressive character poses, in the style of classic 1990s Japanese manga similar to Pokémon or Digimon, dynamic composition, cute and friendly aesthetic, no photorealism, comic panel style.
```

**Vintage Comic:**
```
Black and white vintage comic panel illustration, highly detailed, realistic rendering, heavy ink shading, bold lines, high contrast, comic speech bubbles in cartoon style where needed, square format, no color, no background noise, clean composition.
```

**Cartoon Avatar Style:**
```
3D cartoon avatar style illustration of a [subject] head, centered in square format. Expressive and exaggerated facial features, large friendly eyes, clean bold outlines, soft airbrushed shading, bright and saturated colors, glossy highlights on surfaces, polished mobile app sticker style, inspired by Apple Memoji and modern emoji characters. Simple pure white background, no extra elements, no text, no shadow outside subject.
```

**Watercolor Style:**
```
Decorative illustration in refined watercolor painting style. Vibrant yet natural colors with high contrast and tasteful saturation, clean and controlled color bleeds, sharp and defined edges where needed, layered transparent washes, soft and dynamic brush textures. Strong silhouette with visual impact, designed for clear visibility on fabric. Use a natural and harmonious color palette (earth tones, gentle blues, soft greens, warm ochres). Subtle paper texture optional. Composition optimized for centered print with a bold, eye-catching but elegant design. No background noise, no borders, no framing elements, no digital artifacts.
```

**Realistic Style:**
```
Design in photorealistic style with detailed lifelike rendering. Reference style: High-quality photographic aesthetics, detailed textures, natural lighting and shadows, accurate proportions, realistic materials and surfaces. Use professional photography composition with crisp details and lifelike color accuracy.
```

**Children's Book Style:**
```
Children's book style illustration with modern artistic flair. Anthropomorphic character wearing trendy clothing, posed dynamically. Clean bold shapes, playful color palette, soft visible texture, hand-painted look. Flat white background with no shadows or borders. Whimsical and stylish, suitable for children's books or fashion prints. Simple and charming composition with clear character focus. No gradients, no photorealism, no background elements.
```

**Black & White Style:**
```
Black and white realistic photograph of a vintage camera, highly detailed, sharp focus, dramatic lighting with strong shadows, high contrast, retro aesthetic, centered composition, no background noise, plain background.
```

**Botanical Style:**
```
Hand-drawn botanical illustration for product design. Delicate ink or pencil style linework with subtle shading. Detailed flowers, leaves, and stems, natural composition with artistic flow. Minimalist color palette (black on white, or with subtle muted pastels). Plenty of white space, centered composition. Designed for stylish women's fashion products. No gradients, no photorealism, no digital textures. Light and elegant aesthetic with a touch of vintage charm.
```

**Grunge Style:**
```
Grunge rock poster product design. Bold distressed illustration with rough ink textures and high contrast. Gritty hand-drawn typography with worn-out edges. Central subject (skull, guitar, snake, wings, lightning, animal, biker, rock symbol) in dramatic composition. Grainy print texture with cracks and rough background. Limited color palette (black/white/red or black/white/yellow). Designed for bold statement on streetwear or music-themed products. No clean digital look — raw and edgy aesthetic.
```

## Prompt Enhancement Process

### 1. User Prompt Cleaning
- Remove special characters except basic punctuation
- Trim whitespace
- Validate length (3-1000 characters)

### 2. Background Optimization
**For Black products:**
```
subject centered on the screen. zoomed in on subject. with Flat black background. no background noise. 
bright colors and light elements that will stand out on a black background.
```

**For White products:**
```
subject centered on the screen. zoomed in on subject. . no white noise.
```

### 3. Technical Specifications
```
High resolution, professional quality, optimized for printing, centered composition, clean edges, no background noise or artifacts.
```

### 4. Content Guidelines
```
no offensive content, no copyrighted images
```

## DALL-E 3 Configuration

### Two-Tier Quality System:

#### Preview Generation (Standard Quality):
- **Model:** `gpt-image-1`
- **Size:** `1024x1024`
- **Quality:** `standard`
- **Purpose:** Fast preview generation for design iteration
- **Speed:** ~10-20 seconds

#### Checkout Generation (HD Quality):
- **Model:** `gpt-image-1`
- **Size:** `1024x1024`
- **Quality:** `hd`
- **Purpose:** High-quality final version for printing
- **Speed:** ~30-60 seconds

### Why This Approach:
- **Fast Iteration:** Standard quality allows users to quickly test ideas and styles
- **Cost Effective:** Standard quality costs less, allowing more experimentation
- **Premium Final Product:** HD quality ensures the final product meets printing standards
- **Better UX:** Users get immediate feedback while ensuring quality output

## Final Prompt Structure

```
[USER_PROMPT]. Style: [STYLE_INSTRUCTIONS] [BACKGROUND_INSTRUCTIONS] [TECHNICAL_SPECS] [CONTENT_GUIDELINES]
```

### Example Final Prompt:
```
Disappointed crocodile wearing a hat sitting at a coffee shop with the text "Monday Mood". Style: Create in classic comic book style with vintage pop art aesthetics. Reference style: Bold black outlines, Ben-Day halftone dot patterns, bright primary colors (red, blue, yellow), speech bubble elements, vintage comic typography. Use dynamic action lines, high contrast colors, and retro comic book illustration techniques. subject centered on the screen. zoomed in on subject. . no white noise. High resolution, professional quality, optimized for printing, centered composition, clean edges, no background noise or artifacts. no offensive content, no copyrighted images
```

## Error Handling & Validation

### Content Policy Violations
- Filters out potentially problematic words
- Provides user-friendly error messages
- Suggests alternative approaches

### Rate Limiting
- Implements delays between requests
- Handles quota exceeded errors
- Provides clear feedback to users

### Quality Assurance
- Validates API responses
- Ensures image URLs are valid
- Captures DALL-E 3's revised prompts for transparency

## Quality Management

### Preview Phase:
- Uses standard quality for speed
- Allows rapid iteration and style testing
- Provides immediate visual feedback
- Lower cost per generation

### Checkout Phase:
- Automatically generates HD version when adding to cart
- Ensures print-ready quality
- Stores both versions for comparison
- Seamless upgrade without user intervention

This two-tier approach balances user experience with quality output, allowing creative exploration while ensuring professional results.
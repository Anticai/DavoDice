# Enhanced Animations Integration Guide

This document provides instructions for integrating the new enhanced animations with your existing Blood Bowl Dice Calculator application.

## Overview

The enhanced animations provide more fluid, responsive, and visually appealing animations by leveraging:

1. Native driver for better performance
2. Spring animations for more natural movement
3. Improved easing functions
4. Staggered sequencing for more complex effects

## Integration Steps

### Step 1: Import the Enhanced Animations

In your component files where animations are used, add imports for the enhanced animation functions:

```typescript
import {
  createEnhancedReturnAnimation,
  createEnhancedNumberShowAnimation,
  createEnhancedShakeAnimation,
  createEnhancedEatingAnimation,
  createEnhancedPulseAnimation,
  createEnhancedSelectAnimation
} from '../animations/enhancedAnimations';
```

### Step 2: Replace Existing Animation Functions

#### In `Dice.tsx`:

Replace:
```typescript
import {
  createReturnAnimation,
  createNumberShowAnimation
  // other imports...
} from '../animations/diceAnimations';

// Later in the code...
const returnAnimation = createReturnAnimation(panX, panY, rotationValue);
```

With:
```typescript
import {
  // other imports...
} from '../animations/diceAnimations';

import {
  createEnhancedReturnAnimation,
  createEnhancedNumberShowAnimation
} from '../animations/enhancedAnimations';

// Later in the code...
const returnAnimation = createEnhancedReturnAnimation(panX, panY, rotationValue);
```

Also replace:
```typescript
createNumberShowAnimation(animationProgress).start();
```

With:
```typescript
createEnhancedNumberShowAnimation(animationProgress).start();
```

#### In `AnimationDemoScreen.tsx`:

Replace:
```typescript
import * as diceAnimations from '../animations/diceAnimations';

// Later in the code...
runRotateAnimation(val => diceAnimations.createShakeAnimation(val));
```

With:
```typescript
import * as diceAnimations from '../animations/diceAnimations';
import { createEnhancedShakeAnimation } from '../animations/enhancedAnimations';

// Later in the code...
runRotateAnimation(val => createEnhancedShakeAnimation(val));
```

#### In `NumberSelection.tsx` (for eating animation):

Find where the eating animation is defined, which typically looks something like:
```typescript
const eatingAnim = Animated.timing(eatingAnimValue, {
  toValue: 1,
  duration: 250,
  useNativeDriver: true,
  // other config...
});
```

And replace it with:
```typescript
import { createEnhancedEatingAnimation } from '../animations/enhancedAnimations';

// Later in the code...
const scaleValue = useRef(new Animated.Value(1)).current;
const opacityValue = useRef(new Animated.Value(1)).current;

// Later when animation is triggered...
const eatingAnim = createEnhancedEatingAnimation(scaleValue, opacityValue);
```

### Step 3: Testing the Implementation

1. Implement the animations one at a time
2. Test each animation after implementation to ensure it works correctly
3. Compare with the previous animation to verify improvement

### Step 4: Fine-Tuning

You may need to adjust animation parameters based on your specific use case. Here are some key parameters to consider:

- `friction` and `tension` for spring animations
- `duration` for timing animations
- `easing` functions for timing animations
- `staggerMs` for staggered animations

## Troubleshooting

If you encounter issues with the enhanced animations:

1. **Performance issues**: Ensure `useNativeDriver: true` is set for all animations where possible
2. **Visual glitches**: Check that initial and final values are properly set
3. **Animation not running**: Verify that `.start()` is called on the animation
4. **Animations not working on older devices**: Consider adding fallback options with simpler animations

## Best Practices

1. Always reset animation values before starting new animations
2. Use callback functions with `.start()` to chain animations
3. Keep animations responsive by adjusting duration based on screen size
4. Provide visual feedback for user interactions
5. Use spring animations for physics-based interactions

## Example Implementation

For a complete example of how these animations can be used together, see the `AnimationExampleScreen.tsx` file which demonstrates all the enhanced animations. 
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { H1, H2, Body } from '../components/Text';
import { Button } from '../components/Button';
import { Animated } from 'react-native';
import { useAnimation } from '../hooks';
import { zoomAnimations, diceAnimations } from '../animations';

export const AnimationDemoScreen: React.FC = () => {
  const { colors } = useTheme();
  const [count, setCount] = useState(0);
  const [animationType, setAnimationType] = useState<'count' | 'bounce' | 'flash'>('bounce');
  
  const { animatedValue: scaleValue, runAnimation: runScaleAnimation } = useAnimation({ initialValue: 1 });
  const { animatedValue: rotateValue, runAnimation: runRotateAnimation } = useAnimation({ initialValue: 0 });
  
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  const handleDecrement = () => {
    setCount(prev => Math.max(0, prev - 1));
  };
  
  const handleChangeAnimationType = (type: 'count' | 'bounce' | 'flash') => {
    setAnimationType(type);
  };
  
  const handleZoomIn = () => {
    runScaleAnimation(val => zoomAnimations.createZoomInAnimation(val, 1.3));
  };
  
  const handleZoomOut = () => {
    runScaleAnimation(val => zoomAnimations.createZoomOutAnimation(val, 1));
  };
  
  const handlePulse = () => {
    runScaleAnimation(val => zoomAnimations.createPulseAnimation(val, 0.9, 1.2, 3));
  };
  
  const handleShake = () => {
    runRotateAnimation(val => diceAnimations.createShakeAnimation(val));
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.main }]}>
      <H1 style={{ color: colors.text.primary, marginBottom: 20 }}>Animation Demo</H1>
      
      <View style={styles.section}>
        <H2 style={{ color: colors.text.primary }}>Animated Number</H2>
        <Body style={{ color: colors.text.secondary, marginBottom: 10 }}>
          Demonstrates different number animations
        </Body>
        
        <View style={styles.numberContainer}>
          <AnimatedNumber 
            value={count} 
            animationType={animationType}
            style={{ fontSize: 48, color: colors.primary }}
          />
        </View>
        
        <View style={styles.buttonRow}>
          <Button 
            title="-" 
            onPress={handleDecrement} 
            size="small"
            style={{ marginRight: 10 }}
          />
          <Button 
            title="+" 
            onPress={handleIncrement} 
            size="small"
          />
        </View>
        
        <View style={styles.buttonRow}>
          <Button 
            title="Count" 
            onPress={() => handleChangeAnimationType('count')} 
            variant={animationType === 'count' ? 'primary' : 'outlined'}
            size="small"
            style={{ marginRight: 10 }}
          />
          <Button 
            title="Bounce" 
            onPress={() => handleChangeAnimationType('bounce')} 
            variant={animationType === 'bounce' ? 'primary' : 'outlined'}
            size="small"
            style={{ marginRight: 10 }}
          />
          <Button 
            title="Flash" 
            onPress={() => handleChangeAnimationType('flash')} 
            variant={animationType === 'flash' ? 'primary' : 'outlined'}
            size="small"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <H2 style={{ color: colors.text.primary }}>Scale Animations</H2>
        <Body style={{ color: colors.text.secondary, marginBottom: 10 }}>
          Demonstrates different scale animations
        </Body>
        
        <Animated.View style={[
          styles.animatedBox, 
          { 
            backgroundColor: colors.primary,
            transform: [{ scale: scaleValue }]
          }
        ]} />
        
        <View style={styles.buttonRow}>
          <Button 
            title="Zoom In" 
            onPress={handleZoomIn} 
            size="small"
            style={{ marginRight: 10 }}
          />
          <Button 
            title="Zoom Out" 
            onPress={handleZoomOut} 
            size="small"
            style={{ marginRight: 10 }}
          />
          <Button 
            title="Pulse" 
            onPress={handlePulse} 
            size="small"
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <H2 style={{ color: colors.text.primary }}>Rotation Animations</H2>
        <Body style={{ color: colors.text.secondary, marginBottom: 10 }}>
          Demonstrates rotation animations
        </Body>
        
        <Animated.View style={[
          styles.animatedBox, 
          { 
            backgroundColor: colors.secondary,
            transform: [
              { 
                rotate: rotateValue.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-30deg', '30deg']
                }) 
              }
            ]
          }
        ]} />
        
        <View style={styles.buttonRow}>
          <Button 
            title="Shake" 
            onPress={handleShake} 
            size="small"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 30,
    padding: 16,
    borderRadius: 8,
  },
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  animatedBox: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
  },
}); 
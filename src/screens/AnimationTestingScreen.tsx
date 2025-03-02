import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAccessibleAnimations } from '../hooks/useAccessibleAnimations';
import { useAnimationPerformance, PerformanceLevel } from '../hooks/useAnimationPerformance';
import NavigationTransition from '../components/NavigationTransition';
import OptimizedParticleSystem from '../components/OptimizedParticleSystem';
import * as AnimationTestingUtils from '../animations/AnimationTestingUtils';

const AnimationTestingScreen: React.FC = () => {
  const { colors } = useTheme();
  const { options: accessibilityOptions } = useAccessibleAnimations();
  const { config: performanceConfig } = useAnimationPerformance();
  
  const [testResults, setTestResults] = useState<string>('No tests run yet');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  // Animation values for testing
  const scaleAnim = new Animated.Value(1);
  const translateAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  
  // Reset all animations
  const resetAnimations = () => {
    scaleAnim.setValue(1);
    translateAnim.setValue(0);
    opacityAnim.setValue(1);
    rotateAnim.setValue(0);
  };
  
  // Simple animation for testing
  const runSimpleAnimation = () => {
    resetAnimations();
    return Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.parallel([
        Animated.timing(translateAnim, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
  };
  
  // Complex animation for testing
  const runComplexAnimation = () => {
    resetAnimations();
    setShowParticles(true);
    
    return Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.8,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(2)),
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 80,
        }),
      ]),
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 2,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(translateAnim, {
          toValue: 150,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(translateAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 6,
          tension: 50,
        }),
      ]),
    ]);
  };
  
  // Test animation frame rate
  const testFrameRate = async () => {
    setIsRunningTest(true);
    setTestResults('Running frame rate test...');
    
    try {
      const animation = runSimpleAnimation();
      const frameRateResult = await AnimationTestingUtils.monitorFrameRate(
        () => animation.start(),
        1500
      );
      
      // Format results
      setTestResults(`
Frame Rate Test Results:
- Average FPS: ${frameRateResult.averageFps}
- Min FPS: ${frameRateResult.minFps}
- Max FPS: ${frameRateResult.maxFps}
- Dropped Frames: ${frameRateResult.droppedFrames}
- Duration: ${frameRateResult.duration}ms

${frameRateResult.averageFps > 55 ? '✅ Excellent performance!' : 
  frameRateResult.averageFps > 45 ? '✓ Good performance' : 
  frameRateResult.averageFps > 30 ? '⚠️ Fair performance - consider optimization' : 
  '❌ Poor performance - needs optimization'}
      `);
    } catch (error) {
      setTestResults(`Error in frame rate test: ${error}`);
    }
    
    setIsRunningTest(false);
  };
  
  // Test across performance levels
  const testPerformanceLevels = async () => {
    setIsRunningTest(true);
    setTestResults('Testing across performance levels...');
    
    try {
      const results = await AnimationTestingUtils.testAcrossPerformanceLevels(
        () => runSimpleAnimation().start(),
        1000
      );
      
      // Format results
      let formattedResults = 'Performance Level Test Results:\n';
      
      Object.entries(results).forEach(([level, result]) => {
        formattedResults += `\n${level.toUpperCase()} Performance Level:\n`;
        formattedResults += `- Average FPS: ${result.averageFps}\n`;
        formattedResults += `- Dropped Frames: ${result.droppedFrames}\n`;
      });
      
      setTestResults(formattedResults);
    } catch (error) {
      setTestResults(`Error in performance level test: ${error}`);
    }
    
    setIsRunningTest(false);
  };
  
  // Test native driver compatibility
  const testNativeDriver = () => {
    setIsRunningTest(true);
    
    // Create a test animation with native driver
    const nativeAnimation = Animated.timing(scaleAnim, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: true,
    });
    
    // Create a test animation without native driver
    const nonNativeAnimation = Animated.timing(scaleAnim, {
      toValue: 1.5,
      duration: 300,
      useNativeDriver: false,
    });
    
    const isNativeCompatible = AnimationTestingUtils.isNativeDriverCompatible(nativeAnimation);
    const isNonNativeCompatible = AnimationTestingUtils.isNativeDriverCompatible(nonNativeAnimation);
    
    setTestResults(`
Native Driver Compatibility Test:

Test Animation 1 (with native driver):
- Native Driver Compatible: ${isNativeCompatible ? '✅ Yes' : '❌ No'}

Test Animation 2 (without native driver):
- Native Driver Compatible: ${isNonNativeCompatible ? '✅ Yes' : '❌ No'}

Native driver animations are more performant as they run on a separate thread.
    `);
    
    setIsRunningTest(false);
  };
  
  // Test estimated load
  const testEstimatedLoad = async () => {
    setIsRunningTest(true);
    setTestResults('Testing estimated load...');
    
    try {
      // Test simple animation
      const simpleResult = await AnimationTestingUtils.testAnimationMemoryUsage(
        () => [runSimpleAnimation()],
        (anims) => anims[0].start()
      );
      
      // Test complex animation
      const complexResult = await AnimationTestingUtils.testAnimationMemoryUsage(
        () => [runComplexAnimation()],
        (anims) => anims[0].start()
      );
      
      // Format results
      setTestResults(`
Estimated Load Test Results:

Simple Animation:
- Estimated Load: ${simpleResult.estimatedLoad.toFixed(2)}ms

Complex Animation:
- Estimated Load: ${complexResult.estimatedLoad.toFixed(2)}ms

Comparison:
${complexResult.estimatedLoad > simpleResult.estimatedLoad * 1.5 
  ? '⚠️ Complex animation has significantly higher load' 
  : '✅ Load difference is acceptable'}
      `);
    } catch (error) {
      setTestResults(`Error in estimated load test: ${error}`);
    }
    
    setIsRunningTest(false);
  };
  
  // Run full performance report
  const runPerformanceReport = async () => {
    setIsRunningTest(true);
    setTestResults('Generating performance report...');
    
    try {
      await AnimationTestingUtils.logAnimationPerformance(
        'Test Animation',
        () => runComplexAnimation().start()
      );
      
      setTestResults('Performance report logged to console. Check your development console for results.');
    } catch (error) {
      setTestResults(`Error in performance report: ${error}`);
    }
    
    setIsRunningTest(false);
  };
  
  // Run demo animation
  const runDemoAnimation = () => {
    const animation = runComplexAnimation();
    animation.start(() => {
      setTimeout(() => {
        setShowParticles(false);
        resetAnimations();
      }, 500);
    });
  };
  
  return (
    <NavigationTransition type="fade">
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.main }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          Animation Testing
        </Text>
        
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.animatedBox,
              { 
                backgroundColor: colors.primary,
                transform: [
                  { scale: scaleAnim },
                  { translateX: translateAnim },
                  { rotate: rotateAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: ['0deg', '180deg', '360deg']
                  })}
                ],
                opacity: opacityAnim
              }
            ]}
          />
          
          <OptimizedParticleSystem
            type="confetti"
            count={50}
            duration={1500}
            x={150}
            y={100}
            trigger={showParticles}
            onComplete={() => setTimeout(() => setShowParticles(false), 500)}
          />
        </View>
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Device Information
            </Text>
            
            <View style={[styles.infoBox, { backgroundColor: colors.background.card }]}>
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Animations Enabled: {accessibilityOptions.animationsEnabled ? 'Yes' : 'No'}
              </Text>
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Reduced Motion: {accessibilityOptions.reduceMotion ? 'Yes' : 'No'}
              </Text>
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Performance Level: {performanceConfig.level}
              </Text>
              <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Max Particles: {performanceConfig.maxParticleCount}
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Demo
            </Text>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={runDemoAnimation}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Run Demo Animation
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Performance Tests
            </Text>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={testFrameRate}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Test Frame Rate
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={testPerformanceLevels}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Test Across Performance Levels
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={testNativeDriver}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Test Native Driver Compatibility
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={testEstimatedLoad}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Test Estimated Load
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={runPerformanceReport}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                Run Performance Report
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Test Results
            </Text>
            
            <View style={[styles.resultsBox, { backgroundColor: colors.background.card }]}>
              <Text style={[styles.resultsText, { color: colors.text.primary }]}>
                {testResults}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NavigationTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  animationContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  resultsBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AnimationTestingScreen; 
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import NavigationTransition, { TransitionType } from '../components/NavigationTransition';

interface DemoCardProps {
  title: string;
  transitionType: TransitionType;
  onSelect: (type: TransitionType) => void;
}

const DemoCard: React.FC<DemoCardProps> = ({ title, transitionType, onSelect }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background.card }]}
      onPress={() => onSelect(transitionType)}
      activeOpacity={0.8}
    >
      <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
        {title}
      </Text>
      <Text style={[styles.cardSubtitle, { color: colors.text.secondary }]}>
        Tap to view demo
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Screen that demonstrates different transition animations
 */
const TransitionExampleScreen: React.FC = () => {
  const { colors } = useTheme();
  const [currentDemo, setCurrentDemo] = useState<TransitionType | null>(null);
  const [inView, setInView] = useState(true);
  
  // Handle card selection
  const handleSelectDemo = (type: TransitionType) => {
    // First hide current demo if any
    if (currentDemo) {
      setInView(false);
      setTimeout(() => {
        setCurrentDemo(type);
        setInView(true);
      }, 400); // Wait for exit animation to complete
    } else {
      setCurrentDemo(type);
      setInView(true);
    }
  };
  
  // Reset demo
  const handleResetDemo = () => {
    setInView(false);
    setTimeout(() => {
      setCurrentDemo(null);
    }, 400);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.main }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Transition Animations
      </Text>
      
      {!currentDemo ? (
        <ScrollView contentContainerStyle={styles.cardsContainer}>
          <DemoCard 
            title="Fade Transition" 
            transitionType="fade"
            onSelect={handleSelectDemo} 
          />
          <DemoCard 
            title="Slide Transition" 
            transitionType="slide"
            onSelect={handleSelectDemo} 
          />
          <DemoCard 
            title="Modal Transition" 
            transitionType="modal"
            onSelect={handleSelectDemo} 
          />
        </ScrollView>
      ) : (
        <View style={styles.demoContainer}>
          <NavigationTransition
            type={currentDemo}
            inView={inView}
            duration={400}
          >
            <View style={[styles.demoContent, { backgroundColor: colors.background.card }]}>
              <Text style={[styles.demoTitle, { color: colors.text.primary }]}>
                {currentDemo.charAt(0).toUpperCase() + currentDemo.slice(1)} Transition
              </Text>
              
              <View style={styles.demoBox}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View 
                    key={`box-${i}`}
                    style={[
                      styles.box, 
                      { backgroundColor: i === 0 ? colors.primary : i === 1 ? colors.secondary : colors.status.warning }
                    ]} 
                  />
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setInView(false);
                  setTimeout(() => {
                    setInView(true);
                  }, 400);
                }}
              >
                <Text style={styles.buttonText}>Replay Animation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.status.info }]}
                onPress={handleResetDemo}
              >
                <Text style={styles.buttonText}>Back to Demo Selection</Text>
              </TouchableOpacity>
            </View>
          </NavigationTransition>
        </View>
      )}
    </SafeAreaView>
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
  cardsContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  demoContent: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  demoBox: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  box: {
    width: 60,
    height: 60,
    margin: 8,
    borderRadius: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TransitionExampleScreen; 
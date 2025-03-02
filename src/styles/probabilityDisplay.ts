import { StyleSheet } from 'react-native';

/**
 * Styles for the probability display component
 */
export const probabilityDisplayStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  probability: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fraction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fractionDivider: {
    height: 2,
    width: 20,
    margin: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleActive: {
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.7,
  },
}); 
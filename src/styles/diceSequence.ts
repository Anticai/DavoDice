import { StyleSheet } from 'react-native';

/**
 * Styles for the dice sequence component
 */
export const diceSequenceStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  scrollView: {
    flexGrow: 0,
  },
  dice: {
    marginHorizontal: 4,
  },
  emptyContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    opacity: 0.5,
  },
  placeholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
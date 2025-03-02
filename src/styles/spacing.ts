import { StyleSheet } from 'react-native';
import { spacing as spacingValues } from './theme';

type SpacingKey = keyof typeof spacingValues;

/**
 * Spacing utilities for consistent layout
 */
export const spacing = {
  /**
   * Creates margin styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  m: (value: SpacingKey) => ({
    margin: spacingValues[value],
  }),
  
  /**
   * Creates margin top styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  mt: (value: SpacingKey) => ({
    marginTop: spacingValues[value],
  }),
  
  /**
   * Creates margin right styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  mr: (value: SpacingKey) => ({
    marginRight: spacingValues[value],
  }),
  
  /**
   * Creates margin bottom styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  mb: (value: SpacingKey) => ({
    marginBottom: spacingValues[value],
  }),
  
  /**
   * Creates margin left styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  ml: (value: SpacingKey) => ({
    marginLeft: spacingValues[value],
  }),
  
  /**
   * Creates horizontal margin styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  mx: (value: SpacingKey) => ({
    marginHorizontal: spacingValues[value],
  }),
  
  /**
   * Creates vertical margin styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  my: (value: SpacingKey) => ({
    marginVertical: spacingValues[value],
  }),
  
  /**
   * Creates padding styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  p: (value: SpacingKey) => ({
    padding: spacingValues[value],
  }),
  
  /**
   * Creates padding top styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  pt: (value: SpacingKey) => ({
    paddingTop: spacingValues[value],
  }),
  
  /**
   * Creates padding right styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  pr: (value: SpacingKey) => ({
    paddingRight: spacingValues[value],
  }),
  
  /**
   * Creates padding bottom styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  pb: (value: SpacingKey) => ({
    paddingBottom: spacingValues[value],
  }),
  
  /**
   * Creates padding left styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  pl: (value: SpacingKey) => ({
    paddingLeft: spacingValues[value],
  }),
  
  /**
   * Creates horizontal padding styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  px: (value: SpacingKey) => ({
    paddingHorizontal: spacingValues[value],
  }),
  
  /**
   * Creates vertical padding styles
   * @param value Space value (xs, sm, md, lg, xl, xxl)
   */
  py: (value: SpacingKey) => ({
    paddingVertical: spacingValues[value],
  }),
};

/**
 * Common layout styles
 */
export const layout = StyleSheet.create({
  // Flex layouts
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerVertical: {
    justifyContent: 'center',
  },
  centerHorizontal: {
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  flex1: {
    flex: 1,
  },
  
  // Gap styles
  gapXs: {
    gap: spacingValues.xs,
  },
  gapSm: {
    gap: spacingValues.sm,
  },
  gapMd: {
    gap: spacingValues.md,
  },
  gapLg: {
    gap: spacingValues.lg,
  },
  gapXl: {
    gap: spacingValues.xl,
  },
}); 
import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import styled from "styled-components/native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0..1 or 0..100
  duration?: number; // ms
  trackColor?: string; // background ring color
  indicatorColor?: string; // progress ring color
  roundedCaps?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode; // centered content (e.g., text)
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircleProgressBar: React.FC<Props> = ({
  size = 120,
  strokeWidth = 10,
  progress,
  duration = 800,
  trackColor = "#E6E6E6",
  indicatorColor = "#4CAF50",
  roundedCaps = true,
  style,
  children,
}) => {
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const cx = size / 2;
  const cy = size / 2;

  // Normalize progress: accept 0..1, or 0..100
  const target = useMemo(() => {
    const v = progress > 1 ? progress / 100 : progress;
    return Math.max(0, Math.min(1, isNaN(v as number) ? 0 : (v as number)));
  }, [progress]);

  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(target, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [target, duration, animated]);

  const animatedProps = useAnimatedProps(() => {
    const offset = circumference * (1 - animated.value);
    return {
      strokeDashoffset: offset,
    } as any;
  });

  return (
    <Container style={style}>
      <Svg width={size} height={size}>
        {/* Rotate so progress starts at 12 o'clock */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={roundedCaps ? "round" : "butt"}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={indicatorColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap={roundedCaps ? "round" : "butt"}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>
      {children ? (
        <CenterContent pointerEvents="none">{children}</CenterContent>
      ) : null}
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

const CenterContent = styled(View)`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const styles = StyleSheet.create({});

export default CircleProgressBar;

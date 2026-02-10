export interface CoordNames {
  x: string;
  y: string;
  t?: string;
  z?: string;
}

export interface VariableProps {
  magnitude?: string;
  xvector?: string;
  yvector?: string;
  direction?: string;
}

export interface ScalarDatakeys {
  x: string;
  y: string;
  c?: string;
  u?: string;
  v?: string;
}

export interface VectorDatakeys {
  x: string;
  y: string;
  u?: string;
  v?: string;
  m?: string;
  d?: string;
}

export function buildScalarDatakeys(
  coordNames: CoordNames,
  props: VariableProps,
): ScalarDatakeys {
  const datakeys: ScalarDatakeys = { x: coordNames.x, y: coordNames.y };
  if (props.xvector && props.yvector) {
    datakeys.u = props.xvector;
    datakeys.v = props.yvector;
  } else {
    datakeys.c = props.magnitude;
  }
  return datakeys;
}

export function buildVectorDatakeys(
  coordNames: CoordNames,
  props: VariableProps,
): VectorDatakeys {
  const datakeys: VectorDatakeys = { x: coordNames.x, y: coordNames.y };
  if (props.xvector && props.yvector) {
    datakeys.u = props.xvector;
    datakeys.v = props.yvector;
  } else {
    datakeys.m = props.magnitude;
    datakeys.d = props.direction;
  }
  return datakeys;
}

export function getVariableNames(props: VariableProps): string[] {
  const names: string[] = [];
  if (props.magnitude) names.push(props.magnitude);
  if (props.xvector) names.push(props.xvector);
  if (props.yvector) names.push(props.yvector);
  if (props.direction) names.push(props.direction);
  return names;
}

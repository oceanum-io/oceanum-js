// Mock @deck.gl/core for testing
export class CompositeLayer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props?: Record<string, any>) {
    this.props = props || {};
    this.state = {};
    this.context = {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState(update: Record<string, any>) {
    Object.assign(this.state, update);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static defaultProps: Record<string, any> = {};
}

export class Layer extends CompositeLayer {}

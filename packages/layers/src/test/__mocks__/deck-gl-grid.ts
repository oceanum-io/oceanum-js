// Mock @oceanum/deck-gl-grid layers for testing
class MockLayer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: Record<string, any>) {
    this.props = props;
  }
}

export class PcolorLayer extends MockLayer {}
export class ParticleLayer extends MockLayer {}
export class PartmeshLayer extends MockLayer {}
export class ContourLayer extends MockLayer {}

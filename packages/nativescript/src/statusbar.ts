declare let Application: any;

export type Animation = 'Fade' | 'Slide' | 'None';

export class Statusbar {
  static hide(animationType: Animation = 'None') {
    this.setStatus(true, animationType);
  }

  static show(animationType: Animation = 'None') {
    this.setStatus(false, animationType)
  }

  private static setStatus(status: boolean, animationType: Animation) {
    const animation = this.getAnimation(animationType);
    Application.ios.nativeApp.setStatusBarHiddenWithAnimation(status, animation);
  }

  private static getAnimation(animationType: Animation) {
    let animation = 0;
    switch (animationType) {
      case 'Fade':
        animation = 1;
        break;
      case 'Slide':
        animation = 2;
      default:
        animation = 0;
        break;
    }
    return animation;
  }
}
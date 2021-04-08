import { promisify } from '@tdallau/helpers';

export interface AnimationRange {
    from: number;
    to: number;
};

export type JSAnimationDefinition = {
    getRange: () => AnimationRange;
    curve: (progress: number) => number;
    draw: (value: number) => void;
    condition: () => boolean;
};

export function amountFromTo(range: AnimationRange) {
    return (t: number) => {
        return range.from + t * (range.to - range.from);
    };
}

export function animate(
    durration: number,
    animations: Array<JSAnimationDefinition>
) {
    const start = new Date();
    return promisify<void>((resolve, _reject) => {
        const timerId = setInterval(() => {
            const timePassed = new Date().valueOf() - start.valueOf();
            let progress = timePassed / durration;
            if (progress > 1) progress = 1;

            for (const animation of animations) {
              const delta = animation.curve(progress);
              const value = amountFromTo(animation.getRange())(delta);

              if(animation.condition()) {
                animation.draw(value);
              }
            }

            if(progress === 1) {
              clearInterval(timerId);
              resolve()
            }
        }, 17);
    });
}

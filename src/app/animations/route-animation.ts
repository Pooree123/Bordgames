import {
  trigger,
  transition,
  style,
  query,
  animate,
  group,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,

          transform: 'translateY(20px) scale(.98)',
        }),

        animate(
          '350ms ease-out',

          style({
            opacity: 1,

            transform: 'translateY(0) scale(1)',
          }),
        ),
      ],
      { optional: true },
    ),
  ]),
]);

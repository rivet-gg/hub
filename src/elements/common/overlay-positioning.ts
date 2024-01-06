import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';
import { cssify } from '../../utils/css';
import { windowEventGroups } from '../../utils/global-events';
import timing from '../../utils/timing';
import styles from './overlay-positioning.scss';

// Anchor point relative to overlay element:
// TL   TC   TR
//    ┌────┐
// CL │    │
//    └────┘
//      BC
export enum Orientation {
	TopLeft,
	TopCenter,
	CenterLeft,
	BottomCenter,
	TopRight
}

// Corner positions the overlay element's corner fixed with the corner of the context element, Center
// positions the overlay element's corner fixed with the center of the context element
export enum Alignment {
	Corner = 0,
	Center = 0.5
}

const PADDING = 10; // Keep in sync with overlay-positioning.scss
const TRANSITION_LENGTH = timing.milliseconds(200); // Match with consts.scss/$transition-length

@customElement('overlay-positioning')
export default class OverlayPositioning extends LitElement {
	static styles = cssify(styles);

	@property({ type: Boolean })
	active = true;

	@property({ type: Boolean })
	open = false;

	@property({ type: Boolean })
	closing = false;

	// Whether or not the close element dims the screen
	@property({ type: Boolean, attribute: 'dim' })
	dim = false;

	// Allows manually setting the anchor values
	@property({ type: Boolean, attribute: 'manual' })
	manual = false;

	// Used by tooltip to prevent pointer events on the overlay
	@property({ type: Boolean, attribute: 'no-pointer' })
	noPointer = false;

	// Enables the scale animation
	@property({ type: Boolean, attribute: 'scale-animation' })
	scaleAnimation = false;

	// Disables the fade animation
	@property({ type: Boolean, attribute: 'fade-animation' })
	fadeAnimation = true;

	@property({ type: Number })
	orientation: Orientation = Orientation.TopLeft;

	// Dictates the automatic alignment of the overlay. Has no effect when manually setting anchor values.
	@property({ type: Number })
	alignment: Alignment = Alignment.Center;

	// See `reAttachContextElement` function below
	@property({ type: Object })
	contextElement?: HTMLElement;

	// Where to position the overlay on the screen
	@property({ type: Number })
	anchorX: number = null;
	@property({ type: Number })
	anchorY: number = null;

	// These values are added to the anchor values. Should only be used when the anchor is implicitly
	// fetched from the context element (with `manual` as false).
	@property({ type: Number, attribute: 'offset-x' })
	offsetX = 0;
	@property({ type: Number, attribute: 'offset-y' })
	offsetY = 0;

	@query('#close')
	closeElement: HTMLElement;

	contextObserver: IntersectionObserver;
	slotObserver: ResizeObserver;

	@property({ type: Number })
	observedWidth = 0;
	@property({ type: Number })
	observedHeight = 0;

	screenWidth = 0;
	screenHeight = 0;

	overflowX = 0;
	overflowY = 0;

	// Amount of time to stay rendered after the close event is triggered
	@property({ type: Number })
	animationGrace: number = TRANSITION_LENGTH;
	closeTimeout: number = null;

	// === EVENT HANDLERS ===
	handleResize: () => void;

	updated(changedProperties: PropertyValues) {
		super.updated(changedProperties);

		if (changedProperties.has('anchorX') || changedProperties.has('anchorY')) {
			this.calculateOverflow();
		}

		if (changedProperties.has('active')) this.toggle(!this.active);
	}

	connectedCallback() {
		super.connectedCallback();

		// Handle resize
		this.handleResize = this.onResize.bind(this);
		windowEventGroups.add('resize', this.handleResize, timing.milliseconds(100));

		this.onResize();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		if (this.contextObserver) this.contextObserver.disconnect();
		if (this.slotObserver) this.slotObserver.disconnect();
	}

	onSlotChange(e: Event) {
		let slot = e.target as HTMLSlotElement;

		let child = slot.assignedElements()[0];
		if (child) {
			// Observes slotted element for size change
			if (!this.slotObserver) {
				this.slotObserver = new ResizeObserver(records => {
					let last = records.at(-1);

					this.observedWidth = last.borderBoxSize[0].inlineSize;
					this.observedHeight = last.borderBoxSize[0].blockSize;
					this.calculateOverflow();
				});
			}
			this.slotObserver.disconnect();
			this.slotObserver.observe(child);

			// Initial size fetch
			let rect = child.getBoundingClientRect();
			this.observedWidth = rect.width;
			this.observedHeight = rect.height;
			this.calculateOverflow();
		}
	}

	// Keeps track of if the overlay's CONTEXT ELEMENT still exists and is visible. The context
	// element is whatever element was chosen as the "context" for this overlay, i.e. the context of a
	// certain context menu is some element that was right clicked. Observing this element is necessary
	// so that the overlay is automatically closed when the context is gone.
	reAttachContextElement() {
		if (this.contextElement) {
			if (!this.contextObserver) {
				this.contextObserver = new IntersectionObserver(
					([entry]) => {
						if (!entry.isIntersecting) this.close();
					},
					{
						root: null,
						threshold: 0.01
					}
				);
			}
			this.contextObserver.disconnect();
			this.contextObserver.observe(this.contextElement);

			if (!this.manual) {
				let rect = this.contextElement.getBoundingClientRect();

				// TODO: Figure out what transformation works best here
				let x = Math.floor(rect.x);
				let y = Math.floor(rect.y);

				// TODO: implement alignment for all orientations
				if (this.orientation == Orientation.TopLeft) {
					this.anchorX = x + rect.width * this.alignment;
					this.anchorY = y + rect.height * this.alignment;
				} else if (this.orientation == Orientation.TopCenter) {
					this.anchorX = x + rect.width / 2;
					this.anchorY = y + rect.height;
				} else if (this.orientation == Orientation.CenterLeft) {
					this.anchorX = x + rect.width;
					this.anchorY = y + rect.height / 2;
				} else if (this.orientation == Orientation.BottomCenter) {
					this.anchorX = x + rect.width / 2;
					this.anchorY = y;
				} else if (this.orientation == Orientation.TopRight) {
					this.anchorX = x + rect.width - rect.width * this.alignment;
					this.anchorY = y + rect.height * this.alignment;
				}
			}
		}
	}

	onResize() {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;

		this.calculateOverflow();
	}

	close(e?: Event) {
		if (e && e.target !== e.currentTarget) return;

		this.toggle(true);
	}

	toggle(option: boolean = this.open) {
		if (option) {
			if (!this.closing) {
				this.closing = true;

				// Trigger reflow for fade out animation
				this.closeElement.style.display = 'none';
				this.closeElement.offsetHeight;
				this.closeElement.style.display = null;

				if (this.fadeAnimation) {
					window.clearTimeout(this.closeTimeout);
					this.closeTimeout = window.setTimeout(() => {
						this.open = false;
						this.dispatchEvent(new Event('close'));
					}, this.animationGrace);
				} else {
					this.open = false;
					this.dispatchEvent(new Event('close'));
				}
			}
		} else {
			window.clearTimeout(this.closeTimeout);

			this.open = true;
			this.closing = false;

			this.reAttachContextElement();
		}
	}

	// Amount of pixels that the overlay overflows the screen (left/top is negative, right/bottom is positive)
	calculateOverflow() {
		if (this.orientation == Orientation.TopLeft) {
			this.overflowX = Math.max(0, this.anchorX + this.observedWidth + PADDING - this.screenWidth);
			this.overflowY = Math.max(0, this.anchorY + this.observedHeight + PADDING - this.screenHeight);
		} else if (this.orientation == Orientation.TopCenter) {
			this.overflowX =
				Math.max(0, this.anchorX + this.observedWidth / 2 + PADDING - this.screenWidth) +
				Math.min(0, this.anchorX - this.observedWidth / 2 - PADDING);
			this.overflowY = Math.max(0, this.anchorY + this.observedHeight + PADDING - this.screenHeight);
		} else if (this.orientation == Orientation.CenterLeft) {
			this.overflowX = Math.max(0, this.anchorX + this.observedWidth + PADDING - this.screenWidth);
			this.overflowY =
				Math.max(0, this.anchorY + this.observedHeight / 2 + PADDING - this.screenHeight) +
				Math.min(0, this.anchorY - this.observedHeight / 2 - PADDING);
		} else if (this.orientation == Orientation.BottomCenter) {
			this.overflowX =
				Math.max(0, this.anchorX + this.observedWidth / 2 + PADDING - this.screenWidth) +
				Math.min(0, this.anchorX - this.observedWidth / 2 - PADDING);
			this.overflowY = Math.min(0, this.anchorY - this.observedHeight - PADDING);
		} else if (this.orientation == Orientation.TopRight) {
			this.overflowX = Math.min(0, this.anchorX - this.observedWidth - PADDING);
			this.overflowY = Math.max(0, this.anchorY + this.observedHeight + PADDING - this.screenHeight);
		}
	}

	getAdjustedAnchorX() {
		let x = this.anchorX + this.offsetX;

		// Width offset
		if (this.orientation == Orientation.TopCenter || this.orientation == Orientation.BottomCenter) {
			x -= this.observedWidth / 2;
		} else if (this.orientation == Orientation.TopRight) {
			x -= this.observedWidth;
		}

		// Clamp to within PADDING of screen
		x = Math.min(Math.max(x, PADDING), this.screenWidth - PADDING);

		// Overlay off of screen
		if (this.overflowX > 0) {
			let doFlip =
				this.orientation == Orientation.TopLeft ||
				this.orientation == Orientation.CenterLeft ||
				this.orientation == Orientation.TopRight;

			// Offset from mouse to anchor is greater than 1/4 the width of the overlay
			if (doFlip && this.overflowX > this.observedWidth / 4) {
				// Flips the anchor side from left to right
				x += Math.max(this.observedWidth - x + PADDING, 0) - this.observedWidth;
			}
			// Otherwise keep the overlay on screen by "sticking" to the side of the screen
			else x -= this.overflowX;
		}

		return x;
	}

	getAdjustedAnchorY() {
		let y = this.anchorY + this.offsetY;

		// Height offset
		if (this.orientation == Orientation.CenterLeft) {
			y -= this.observedHeight / 2;
		} else if (this.orientation == Orientation.BottomCenter) {
			y -= this.observedHeight;
		}

		// Clamp to within PADDING of screen
		y = Math.min(Math.max(y, PADDING), this.screenHeight - PADDING);
		// Overlay off of screen
		if (this.overflowY > 0) {
			let doFlip =
				this.orientation == Orientation.TopLeft ||
				this.orientation == Orientation.TopCenter ||
				this.orientation == Orientation.BottomCenter ||
				this.orientation == Orientation.TopRight;

			// Offset from mouse to anchor is greater than 1/4 the height of the overlay
			if (doFlip && this.overflowY > this.observedHeight / 4) {
				// Flips the anchor side from top to bottom
				y += Math.max(this.observedHeight - y + PADDING, 0) - this.observedHeight;
			}
			// Otherwise keep the overlay on screen by "sticking" to the side of the screen
			else y -= this.overflowY;
		}

		return y;
	}

	getTransformOrigin() {
		if (this.orientation == Orientation.TopLeft) {
			return 'left top';
		} else if (this.orientation == Orientation.TopCenter) {
			return 'center top';
		} else if (this.orientation == Orientation.CenterLeft) {
			return 'left center';
		} else if (this.orientation == Orientation.BottomCenter) {
			return 'center bottom';
		} else if (this.orientation == Orientation.TopRight) {
			return 'right top';
		}

		return null;
	}

	render() {
		let contextElementBox = this.contextElement?.getBoundingClientRect();
		let anchorX = this.getAdjustedAnchorX();
		let anchorY = this.getAdjustedAnchorY();
		let closeClasses = classMap({
			'no-pointer': this.noPointer,
			closing: this.closing,
			open: this.open,
			dim: this.dim,
			fade: this.fadeAnimation
		});
		let baseStyles = styleMap({
			transform: `translate(${anchorX}px, ${anchorY}px)`,
			'--overlay-size': contextElementBox ? `${contextElementBox?.width}px` : null
		});
		let animationStyles = styleMap({
			transformOrigin: this.getTransformOrigin()
		});

		return html`<div id="close" class=${closeClasses} @click=${this.close.bind(this)}>
			<div id="holder" style=${baseStyles} @click=${this.close.bind(this)}>
				${when(
					this.scaleAnimation,
					() =>
						html`<div id="animation" style=${animationStyles}>
							<slot @slotchange=${this.onSlotChange}></slot>
						</div>`,
					() => html`<slot @slotchange=${this.onSlotChange}></slot>`
				)}
			</div>
		</div>`;
	}
}

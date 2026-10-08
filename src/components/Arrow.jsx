/** The one arrow used across the site: a long, thin stroke. Points right;
 * rotate it in CSS for the other directions. */
function Arrow({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 9h14.5M11 4l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  )
}

export default Arrow

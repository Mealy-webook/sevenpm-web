"use client";

/**
 * The mockup's chip rows — "Festival", "Your goals", "Target audience",
 * "Formats you are interested in".
 *
 * Drawn as squared-off chips rather than the mockup's pills, which is the
 * standing direction for this site; the selected one takes brand yellow, as
 * the mockup does.
 *
 * Single-select renders radios, multi-select renders checkboxes, and both are
 * real inputs behind the label so the group is keyboard-reachable and
 * announced correctly. A div with an onClick would have looked identical and
 * been unusable without a mouse.
 */
export function ChipGroup({
  name,
  legend,
  options,
  multiple = false,
  defaultValue,
}: {
  name: string;
  legend: string;
  options: string[];
  multiple?: boolean;
  defaultValue?: string;
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
      <legend className="mb-1 p-0 font-[family-name:var(--font-display)] text-[14px] font-semibold leading-5 text-white">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="chip relative cursor-pointer border border-white/20 px-4 py-2.5 font-[family-name:var(--font-display)] text-[15px] leading-5 text-white/80 transition-colors hover:border-white/50"
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option}
              defaultChecked={option === defaultValue}
              className="peer sr-only"
            />
            <span className="peer-checked:font-semibold">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

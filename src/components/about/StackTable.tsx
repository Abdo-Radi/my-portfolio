import { Fragment } from "react";

import { skills } from "@/data/skills";

/**
 * The stack, set as a hairline index rather than a field of chips: category on
 * the left three columns, tools on the remaining nine as mono text divided by a
 * thin slash. Density is the point — it should read like a spec sheet.
 *
 * No motion here on purpose. The experience table above is the page's one
 * signature moment; this section stays still.
 */
export function StackTable() {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        Technical stack, grouped by category.
      </caption>

      <colgroup>
        <col style={{ width: "25%" }} />
        <col style={{ width: "75%" }} />
      </colgroup>

      <thead className="sr-only">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Tools</th>
        </tr>
      </thead>

      <tbody>
        {skills.map((group) => (
          <tr
            key={group.category}
            className="group border-t border-rule last:border-b"
          >
            <th
              scope="row"
              className="py-5 pr-4 text-left align-baseline sm:pr-8"
            >
              <span className="t-meta transition-colors duration-300 group-hover:text-ink">
                {group.category}
              </span>
            </th>
            <td className="py-5 align-baseline">
              <p className="font-mono text-[0.8125rem] leading-[1.7] text-ink-2">
                {group.items.map((item, index) => (
                  <Fragment key={item}>
                    {/* Real spaces around the divider, so the run stays
                        breakable and never forces a horizontal scroll. */}
                    {index > 0 ? (
                      <>
                        {" "}
                        <span
                          aria-hidden="true"
                          className="text-ink-3 select-none"
                        >
                          /
                        </span>{" "}
                      </>
                    ) : null}
                    {item}
                  </Fragment>
                ))}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

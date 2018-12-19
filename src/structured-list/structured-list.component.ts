import { Component, Input, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from "@angular/core";
import { ListRow } from "./list-row.component";
import { ListHeader } from "./list-header.component";

/**
 * Structured Lists represent related tabular data. For larger datasets consider a full `Table`.
 *
 * See (structured-list/usage)[https://www.carbondesignsystem.com/components/structured-list/usage] for usage guidance.
 *
 * A basic structued list looks something like:
 * ```
 *	<ibm-structured-list>
 *		<ibm-list-header>
 *			<ibm-list-column nowrap="true">Column 1</ibm-list-column>
 *			<ibm-list-column nowrap="true">Column 2</ibm-list-column>
 *			<ibm-list-column>Column 3</ibm-list-column>
 *		</ibm-list-header>
 *		<ibm-list-row>
 *			<ibm-list-column>Row 1</ibm-list-column>
 *			<ibm-list-column nowrap="true">Row One</ibm-list-column>
 *			<ibm-list-column>
 *				Lorem ipsum dolor sit amet,
 *				consectetur adipiscing elit. Nunc dui magna,
 *				finibus id tortor sed, aliquet bibendum augue.
 *				Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
 *				Pellentesque vulputate nisl a porttitor interdum.
 *			</ibm-list-column>
 *		</ibm-list-row>
 *		<ibm-list-row>
 *			<ibm-list-column>Row 2</ibm-list-column>
 *			<ibm-list-column nowrap="true">Row Two</ibm-list-column>
 *			<ibm-list-column>
 *				Lorem ipsum dolor sit amet,
 *				consectetur adipiscing elit. Nunc dui magna,
 *				finibus id tortor sed, aliquet bibendum augue.
 *				Aenean posuere sem vel euismod dignissim. Nulla ut cursus dolor.
 *				Pellentesque vulputate nisl a porttitor interdum.
 *			</ibm-list-column>
 *		</ibm-list-row>
 *	</ibm-structured-list>
 * ```
 */
@Component({
	selector: "ibm-structured-list",
	template: `
		<section
			class="bx--structured-list"
			[ngClass]="{
				'bx--structured-list--border': border,
				'bx--structured-list--selection': selection,
				'bx--structured-list--condensed': condensed,
				'bx--structured-list-content--nowrap': nowrap
			}">
			<ng-content select="ibm-list-header"></ng-content>
			<div class="bx--structured-list-tbody">
				<ng-content></ng-content>
			</div>
		</section>
	`
})
export class StructuredList implements AfterContentInit {
	/**
	 * A counter to provide unique default values.
	 */
	static listCount = 0;
	/**
	 * Set to true to enable radio like selection of the rows.
	 */
	@Input() selection = false;
	/**
	 * Applies a border and white background.
	 */
	@Input() border = false;
	/**
	 * Applies a condensed style to the headers and rows.
	 */
	@Input() condensed = false;
	/**
	 * Applies `white-space: nowrap` on _all_ conent.
	 */
	@Input() nowrap = false;
	/**
	 * Used when `selection = true` as the row radio group `name`
	 */
	@Input() name = `structured-list-${StructuredList.listCount++}`;
	/**
	 * Emits an event when the row selection changes.
	 *
	 * Emits an object that looks like:
	 * ```
	 * {
	 * 	value: "something",
	 * 	selected: true,
	 * 	name: "structured-list-1"
	 * }
	 * ```
	 */
	@Output() selected: EventEmitter<{value: string, selected: boolean, name: string}> = new EventEmitter();

	@ContentChildren(ListRow) rows: QueryList<ListRow>;
	@ContentChildren(ListHeader) headers: QueryList<ListHeader>;

	ngAfterContentInit() {
		const setSelection = (rowOrHeader: ListRow | ListHeader) => {
			rowOrHeader.selection = this.selection;
		};

		this.headers.forEach(setSelection);
		this.rows.forEach(row => {
			setSelection(row);
			row.name = this.name;
			row.change.subscribe(event => {
				this.selected.emit({
					value: row.value,
					selected: row.selected,
					name: this.name
				});
			});
		});
	}
}

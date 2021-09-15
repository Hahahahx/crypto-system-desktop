import { PageProps } from "@/components";
import { Update } from "ux-redux-module";

class PageModule {
  public page = new Array<PageProps>();

  public active = 0;

  public addPage(newPage: PageProps) {
    const index = this.page.findIndex((item) => item.page === newPage.page);
    if (index != -1) {
      this.active = index;
    } else {
      this.active = this.page.length;
      this.page.push(newPage);
    }
    this.update();
  }

  public setActive(index: number) {
    this.active = index;
    this.update();
  }

  public removePage(index: number) {
    if (
      index < this.active ||
      (this.page.length - 1 === this.active && this.active !== 0)
    ) {
      this.active--;
    }
    this.page.splice(index, 1);
    this.update();
  }

  @Update
  private update() {}
}

export default new PageModule();

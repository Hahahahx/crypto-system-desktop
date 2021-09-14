import Page from "./pages/index";
import PageMain from "./pages/main/index";
import PageTest from "./pages/test/index";
import loadable from "@loadable/component";

const router=[
	{
		config: null,
		component: Page,
		path: "",
		child: [
			{
				config: {
					default: true,
					htmlmeta: {
						title: "首页",
					},
				},
				component: PageMain,
				path: "/main",
				child: null,
			},
			{
				config: null,
				component: PageTest,
				path: "/test",
				child: null,
			},
		],
	},
]

export default router;
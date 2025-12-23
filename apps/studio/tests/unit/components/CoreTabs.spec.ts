import { mount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import CoreTabs from "@/components/CoreTabs.vue";
import { BksConfigProvider } from "@/common/bksConfig/BksConfigProvider";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CoreTabs.vue", () => {
  let wrapper;
  let store;
  let mockBksConfig;

  const createWrapper = (scrollTabsEnabled = false) => {
    // Mock BksConfigProvider
    mockBksConfig = {
      ui: {
        layout: {
          scrollTabs: scrollTabsEnabled,
        },
      },
    };

    // Create minimal store
    store = new Vuex.Store({
      modules: {
        tabs: {
          namespaced: true,
          state: {
            active: null,
            tabs: [],
          },
          getters: {
            sortedTabs: () => [],
            newTabDropdownItems: () => [],
          },
          actions: {
            load: jest.fn(),
            setActive: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
            reorder: jest.fn(),
          },
        },
      },
      state: {
        connection: {},
        connectionType: "postgres",
        usedConfig: null,
        selectedSidebarItem: null,
      },
      getters: {
        dialect: () => "postgres",
        dialectData: () => ({ disabledFeatures: {} }),
        dialectTitle: () => "PostgreSQL",
        isCommunity: () => false,
      },
    });

    const modalMock = {
      hide: jest.fn(),
      show: jest.fn(),
    };

    const nativeMock = {
      dialog: {
        showSaveDialogSync: jest.fn(),
      },
    };

    const utilMock = {
      send: jest.fn().mockResolvedValue({}),
    };

    const notyMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    };

    const copyTextMock = jest.fn();

    wrapper = mount(CoreTabs, {
      localVue,
      store,
      mocks: {
        $modal: modalMock,
        $native: nativeMock,
        $util: utilMock,
        $noty: notyMock,
        $copyText: copyTextMock,
        $bksConfig: mockBksConfig,
        $config: {
          isMac: false,
        },
        $vHotkeyKeymap: jest.fn().mockReturnValue({}),
        $confirm: jest.fn().mockResolvedValue(true),
        $confirmById: jest.fn().mockResolvedValue(true),
        $tour: {
          start: jest.fn(),
        },
      },
      stubs: {
        Draggable: true,
        "core-tab-header": true,
        QueryEditor: true,
        Shell: true,
        PluginBase: true,
        PluginShell: true,
        "tab-with-table": true,
        TableTable: true,
        TableProperties: true,
        TableBuilder: true,
        ImportExportDatabase: true,
        DatabaseBackup: true,
        ImportTable: true,
        modal: true,
        "tab-icon": true,
        "pending-changes-button": true,
        "confirmation-modal": true,
        "sql-files-import-modal": true,
        "create-collection-modal": true,
        "shortcut-hints": true,
        portal: true,
      },
    });
  };

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
    }
  });

  describe("Tab scrolling configuration", () => {
    it("should not apply tabbar--scrollable class when scrollTabs is false (default)", () => {
      createWrapper(false);
      const navTabs = wrapper.find(".nav-tabs");
      expect(navTabs.exists()).toBe(true);
      expect(navTabs.classes()).not.toContain("tabbar--scrollable");
    });

    it("should apply tabbar--scrollable class when scrollTabs is true", () => {
      createWrapper(true);
      const navTabs = wrapper.find(".nav-tabs");
      expect(navTabs.exists()).toBe(true);
      expect(navTabs.classes()).toContain("tabbar--scrollable");
    });
  });
});

from controllers import *
import pytest


def test_home_button_has_home_folder():
    with driver_context() as driver:
        landing_page = LoginPage(driver)
        signup_page = landing_page.to_signup_page()
        filesystem_page = signup_page.signup()
        filesystem_page.go_home()
        xpath = "//div[@class='noselect' and text()='{}']".format(filesystem_page.username)
        filesystem_page.get_unique_xpath(xpath)


def  test_mkdir_and_upload_not_present_in_root():
    with driver_context() as driver:
        landing_page = LoginPage(driver)
        signup_page = landing_page.to_signup_page()
        filesystem_page = signup_page.signup()
        filesystem_page.go_home()
        for xpath in [
            "//span[@title='{}']".format("Create new directory"),
            "//span[@title='{}']".format("Upload file"),
        ]:
            assert not len(filesystem_page.d.find_elements_by_xpath(xpath))


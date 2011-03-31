using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.Drawing;

namespace GCClient
{
    class HotmailRegister : Jobber, IOperationWaiter
    {
        public static string URL_REG = "https://signup.live.com/signup.aspx?id=64855&lic=1";
        public static string URL_CAPIMG_PREFIX = "https://www.google.com/recaptcha/api/image";
        public static string ID_CAPIMG = "iCdHIPRImg";
        public static string ID_INPUT_ACCOUNT = "imembernamelive";
        public static string ID_INPUT_DOMAIN = "idomain";
        public static string ID_BOTTON_CHECK = "ichkavailbutton";
        public static string ID_INPUT_PASSWORD = "iPwd";
        public static string ID_INPUT_PASSWORD2 = "iRetypePwd";
        public static string ID_INPUT_ALTEMAIL = "iAltEmail";
        public static string ID_INPUT_FIRSTNAME = "iFirstName";
        public static string ID_INPUT_LASTNAME = "iLastName";
        public static string ID_INPUT_ZIPCODE = "iZipCode";
        public static string ID_INPUT_COUNTRY = "iCountry";
        public static string ID_INPUT_STATE = "iRegion";
        public static string ID_INPUT_GENDER = "iGenderMale";
        public static string ID_INPUT_BIRTH = "iBirthYear";
        public static string ID_INPUT_CAP = "iCdHIPBInput0";
        public static string ID_FORM = "SignUpForm";

        private void buttonTest_Click(object sender, EventArgs e)
        {
            start();
        }

        private void start(){
            try
            {
	            browser.Navigate(URL_REG);
	            Status = STATUS.LoadingRec;
            }
            catch (System.Exception ex)
            {
                excepted(ex);
            }
        }

        public void operate(string captcha)
        {
            try
            {
	            browser.Document.GetElementById(ID_INPUT_CAP).SetAttribute("value", captcha);
	            browser.Document.GetElementById(ID_FORM).InvokeMember("onsubmit");
            }
            catch (System.Exception ex)
            {
                excepted(ex);
            }
        }

        private void changeStatus(STATUS status, Jobber j)
        {
            labelStatus.Text = status.ToString();
        }

        private void browser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            try
           {
	           if (e.Url.ToString().CompareTo(URL_REG) == 0)
	            {
	                browser.Document.GetElementById(ID_INPUT_ACCOUNT).SetAttribute("value", textBoxAccount.Text);
	                browser.Document.GetElementById(ID_INPUT_DOMAIN).SetAttribute("value", comboBoxDomain.Text);
	                browser.Document.GetElementById(ID_INPUT_PASSWORD).SetAttribute("value", textBoxPassword.Text);
	                browser.Document.GetElementById(ID_INPUT_PASSWORD2).SetAttribute("value", textBoxPassword.Text);
	                browser.Document.GetElementById(ID_INPUT_ALTEMAIL).SetAttribute("value", "gneheix@gmail.com");
	                browser.Document.GetElementById(ID_INPUT_FIRSTNAME).SetAttribute("value", "Test");
	                browser.Document.GetElementById(ID_INPUT_LASTNAME).SetAttribute("value", "Test");
	                browser.Document.GetElementById(ID_INPUT_COUNTRY).SetAttribute("value", "TW");
	                browser.Document.GetElementById(ID_INPUT_ZIPCODE).SetAttribute("value", "10005");
//	                HtmlElement state = browser.Document.GetElementById(ID_INPUT_STATE);
//	                state.SetAttribute("value", state.Children[1].GetAttribute("value"));
	                browser.Document.GetElementById(ID_INPUT_GENDER).SetAttribute("checked", "checked");
	                browser.Document.GetElementById(ID_INPUT_BIRTH).SetAttribute("value", "1983");
	                String captchaUrl = browser.Document.GetElementById(ID_CAPIMG).GetAttribute("src");
	                if (captchaUrl.Contains(URL_CAPIMG_PREFIX))
	                {
	                    wait(captchaUrl);
	                }
	                else{
	                    start();
	                }
	            }
           }
           catch (Exception ex)
           {
               excepted(ex);
           }
        }
        public HotmailRegister(TabControl tabs, string account, string domain, string password):this(tabs){
            this.textBoxAccount.Text = account;
            this.comboBoxDomain.Text = domain;
            this.textBoxPassword.Text = password;
            start();
        }

        public HotmailRegister(TabControl tabs)
        {
            this.reg = new TabPage();
            this.browser = new GCWebBrowser();
            this.groupBox1 = new GroupBox();
            this.label2 = new Label();
            this.label1 = new Label();
            this.textBoxPassword = new TextBox();
            this.textBoxAccount = new TextBox();
            this.labelStatus = new Label();
            this.button = new Button();
            this.label3 = new Label();
            this.comboBoxDomain = new ComboBox();
            tabs.SuspendLayout();
            this.reg.SuspendLayout();
            this.groupBox1.SuspendLayout();
            // 
            // tabs
            // 
            tabs.Controls.Add(this.reg);
            // 
            // reg
            // 
            this.reg.Controls.Add(this.browser);
            this.reg.Controls.Add(this.groupBox1);
            this.reg.Controls.Add(this.labelStatus);
            this.reg.Location = new Point(4, 22);
            this.reg.Name = "reg";
            this.reg.Padding = new Padding(3);
            this.reg.Size = new Size(786, 622);
            this.reg.TabIndex = 0;
            this.reg.Text = "注册Hotmail";
            this.reg.UseVisualStyleBackColor = true;
            // 
            // browser
            // 
            this.browser.Location = new Point(3, 76);
            this.browser.MinimumSize = new Size(20, 20);
            this.browser.Name = "browser";
            this.browser.Size = new Size(780, 520);
            this.browser.TabIndex = 1;
            this.browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(this.browser_DocumentCompleted);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.comboBoxDomain);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.textBoxPassword);
            this.groupBox1.Controls.Add(this.textBoxAccount);
            this.groupBox1.Controls.Add(this.button);
            this.groupBox1.Location = new Point(3, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new Size(780, 67);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "资料";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new Point(398, 29);
            this.label2.Name = "label2";
            this.label2.Size = new Size(41, 12);
            this.label2.TabIndex = 3;
            this.label2.Text = "密码：";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new Point(19, 29);
            this.label1.Name = "label1";
            this.label1.Size = new Size(41, 12);
            this.label1.TabIndex = 3;
            this.label1.Text = "账号：";
            // 
            // textBoxPassword
            // 
            this.textBoxPassword.Location = new Point(445, 26);
            this.textBoxPassword.Name = "textBoxPassword";
            this.textBoxPassword.Size = new Size(100, 21);
            this.textBoxPassword.TabIndex = 2;
            // 
            // textBoxAccount
            // 
            this.textBoxAccount.Location = new Point(66, 26);
            this.textBoxAccount.Name = "textBoxAccount";
            this.textBoxAccount.Size = new Size(145, 21);
            this.textBoxAccount.TabIndex = 2;
            // 
            // labelStatus
            // 
            this.labelStatus.Location = new Point(3, 601);
            this.labelStatus.Name = "labelStatus";
            this.labelStatus.Size = new Size(780, 17);
            this.labelStatus.TabIndex = 1;
            this.labelStatus.UseCompatibleTextRendering = true;
            // 
            // button
            // 
            this.button.Location = new Point(562, 21);
            this.button.Name = "button";
            this.button.Size = new Size(75, 28);
            this.button.TabIndex = 0;
            this.button.Text = "执行";
            this.button.UseVisualStyleBackColor = true;
            this.button.Click += new System.EventHandler(this.buttonTest_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new Point(232, 29);
            this.label3.Name = "label3";
            this.label3.Size = new Size(41, 12);
            this.label3.TabIndex = 3;
            this.label3.Text = "域名：";
            // 
            // comboBoxDomain
            // 
            this.comboBoxDomain.DropDownStyle = ComboBoxStyle.DropDownList;
            this.comboBoxDomain.FormattingEnabled = true;
            this.comboBoxDomain.Items.AddRange(new object[] {
            "hotmail.com.tw",
            "hotmail.com",
            "livemail.tw"});
            this.comboBoxDomain.Location = new Point(271, 26);
            this.comboBoxDomain.Name = "comboBoxDomain";
            this.comboBoxDomain.Size = new Size(121, 20);
            this.comboBoxDomain.TabIndex = 4;
            // 
            // MainForm
            // 
            tabs.ResumeLayout(false);
            this.reg.ResumeLayout(false);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();

            this.statusChangedHandler += this.changeStatus;
            this.browser.UserAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Win32)";
        }

        private TabPage reg;
        private GCWebBrowser browser;
        private GroupBox groupBox1;
        private Label label2;
        private Label label1;
        private TextBox textBoxPassword;
        private TextBox textBoxAccount;
        private Label labelStatus;
        private Button button;
        private Label label3;
        private ComboBox comboBoxDomain;
    }
}

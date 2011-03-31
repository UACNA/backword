using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace GCClient
{
    public class GCWebBrowser : WebBrowser
    {
        bool renavigating = false;

        public string UserAgent { get; set; }

        public GCWebBrowser()
        {
            DocumentCompleted += SetupBrowser;
            Navigate("about:blank");
        }

        void SetupBrowser(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            DocumentCompleted -= SetupBrowser;
            Navigating += BeforeNavigate;
        }

        void BeforeNavigate(object sender, WebBrowserNavigatingEventArgs e)
        {
            if (!string.IsNullOrEmpty(UserAgent))
            {
                if (!renavigating)
                {
                    renavigating = true;
                    e.Cancel = true;
                    Navigate(e.Url, e.TargetFrameName, null,  String.Format("User-Agent: {0}\r\n", UserAgent));
                }
                else
                {
                    renavigating = false;
                }
            }
        }
    }
}

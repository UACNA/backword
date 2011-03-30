using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GCClient
{
    public interface IJobEvent
    {
        void succeed(Object result, Jobber sender);
        void failed(Object result, Jobber sender);
        void excepted(Exception exception, Jobber sender);
        void statusChanged(Jobber.STATUS status, Jobber sender);
        void wait(String captchaUrl, Jobber sender);
    }
}

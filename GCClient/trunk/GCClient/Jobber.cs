using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GCClient
{
    public delegate void SucceedHandler(Object result, Jobber sender);
    public delegate void FailedHandler(Object result, Jobber sender);
    public delegate void ExceptedHandler(Exception exception, Jobber sender);
    public delegate void StatusChangedHandler(Jobber.STATUS status, Jobber sender);
    public delegate void WaitHandler(String captchaUrl, Jobber sender);

    public class Jobber
    {
        protected event SucceedHandler succeedHandler;
        protected event FailedHandler failedHandler;
        protected event ExceptedHandler exceptedHandler;
        protected event StatusChangedHandler statusChangedHandler;
        protected event WaitHandler waitHandler;
        
        public void AddHandler(IJobEvent handler){
            succeedHandler += handler.succeed;
            failedHandler += handler.failed;
            exceptedHandler += handler.excepted;
            statusChangedHandler += handler.statusChanged;
            waitHandler += handler.wait;
      }

        public void removeHandler(IJobEvent handler)
        {
            succeedHandler -= handler.succeed;
            failedHandler -= handler.failed;
            exceptedHandler -= handler.excepted;
            statusChangedHandler -= handler.statusChanged;
            waitHandler -= handler.wait;
        }

        public STATUS Status
        {
            get { return status; }
            protected set { status = value;
            if (statusChangedHandler != null)
                statusChangedHandler(value, this);
            }
        }

        protected void succeed(Object result)
        {
            Status = STATUS.Succeed;
            if (succeedHandler != null)
                succeedHandler(result, this);
        }

        protected void failed(Object result)
        {
            Status = STATUS.Failed;
            if (failedHandler != null)
                failedHandler(result, this);
        }

        protected void excepted(Exception e)
        {
            Status = STATUS.Excepted;
            if (exceptedHandler != null)
                exceptedHandler(e, this);
        }

        protected void wait(String captchaUrl)
        {
            Status = STATUS.WaitOperation;
            if (waitHandler != null)
                waitHandler(captchaUrl, this);
        }

        public enum STATUS
        {
            Initial, LoadingRec, WaitOperation, Running, Succeed, Failed, Excepted
        }
        private STATUS status = STATUS.Initial;
    }
}

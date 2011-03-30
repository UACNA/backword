using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GCClient
{
    public interface IOperationWaiter
    {
        void operate(string captcha);
    }
}
